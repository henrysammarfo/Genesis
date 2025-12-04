import { orchestrator } from '@/lib/agents/orchestrator';
import { supabaseAdmin } from '@/lib/supabase/server';
import { verifyAuth } from '@/lib/auth';
import { BuildRequestSchema, sanitizePrompt, sanitizeError, checkRateLimit } from '@/lib/validation';
import { logger } from '@/lib/logger';

// Calculate credits based on token usage
function calculateCredits(inputTokens: number, outputTokens: number): number {
    const totalTokens = inputTokens + outputTokens;
    return Math.ceil(totalTokens / 1000);
}

export async function POST(req: Request) {
    const requestId = crypto.randomUUID();

    try {
        // 1. Verify authentication
        const { userId, error: authError } = await verifyAuth(req);

        if (authError || !userId) {
            logger.warn('Unauthorized build request', { requestId, error: authError });
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 2. Rate limiting
        const rateLimit = checkRateLimit(userId, 10, 60000); // 10 requests per minute

        if (!rateLimit.allowed) {
            logger.warn('Rate limit exceeded', { userId, requestId });
            return new Response(JSON.stringify({
                success: false,
                error: 'Rate limit exceeded. Please try again later.',
                resetAt: rateLimit.resetAt
            }), {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'X-RateLimit-Remaining': rateLimit.remaining.toString(),
                    'X-RateLimit-Reset': rateLimit.resetAt.toString()
                }
            });
        }

        // 3. Parse and validate input
        const body = await req.json();
        const validation = BuildRequestSchema.safeParse(body);

        if (!validation.success) {
            logger.warn('Invalid request body', { userId, requestId, errors: validation.error.errors });
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid request data',
                details: validation.error.errors.map(e => e.message)
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { prompt, stream, files, useSearch } = validation.data;
        const sanitizedPrompt = sanitizePrompt(prompt);

        logger.info('Build request received', {
            userId,
            requestId,
            promptLength: sanitizedPrompt.length,
            stream,
            useSearch
        });


        // Check user's current credits
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

        if (profileError || !profile) {
            logger.error('User profile not found', { userId, requestId, error: profileError });
            return new Response(JSON.stringify({ success: false, error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // If streaming is requested, use Server-Sent Events
        if (stream) {
            const encoder = new TextEncoder();
            const stream = new ReadableStream({
                async start(controller) {
                    try {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            type: 'status',
                            agent: 'architect',
                            message: 'Analyzing requirements and planning architecture...'
                        })}\\n\\n`));

                        // Build with timeout
                        const buildPromise = orchestrator.buildDApp({
                            prompt: sanitizedPrompt,
                            files,
                            useSearch
                        });

                        const timeoutPromise = new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Build timeout')), 120000) // 2 min timeout
                        );

                        const buildResult = await Promise.race([buildPromise, timeoutPromise]) as any;

                        for (const message of buildResult.messages) {
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                                type: 'message',
                                ...message
                            })}\\n\\n`));
                            await new Promise(resolve => setTimeout(resolve, 100));
                        }

                        if (!buildResult.success || !buildResult.contract) {
                            const errorMsg = sanitizeError(buildResult.error);
                            logger.error('Build failed', { userId, requestId, error: buildResult.error });
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                                type: 'error',
                                message: errorMsg
                            })}\\n\\n`));
                            controller.close();
                            return;
                        }

                        const creditsUsed = buildResult.tokenUsage
                            ? calculateCredits(buildResult.tokenUsage.inputTokens, buildResult.tokenUsage.outputTokens)
                            : 10;

                        if (profile.credits < creditsUsed) {
                            logger.warn('Insufficient credits', { userId, requestId, required: creditsUsed, available: profile.credits });
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                                type: 'error',
                                message: `Insufficient credits. Required: ${creditsUsed}, Available: ${profile.credits}`
                            })}\\n\\n`));
                            controller.close();
                            return;
                        }

                        // Deduct credits atomically
                        await supabaseAdmin
                            .from('profiles')
                            .update({ credits: profile.credits - creditsUsed })
                            .eq('id', userId);

                        await supabaseAdmin.from('credit_transactions').insert({
                            user_id: userId,
                            amount: -creditsUsed,
                            type: 'deduct',
                            description: `dApp generation: "${sanitizedPrompt.substring(0, 50)}..." (${buildResult.tokenUsage?.totalTokens || 0} tokens)`,
                        });

                        logger.info('Credits deducted', { userId, requestId, creditsUsed });

                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            type: 'status',
                            agent: 'deployer',
                            message: 'Deploying smart contract to blockchain...'
                        })}\\n\\n`));

                        let deploymentResult = null;
                        try {
                            const { getUserDeployer } = await import('@/lib/deployer');
                            const deployer = await getUserDeployer(userId);
                            deploymentResult = await deployer.deployContract(buildResult.contract.code);
                            logger.info('Deployment successful', { userId, requestId, address: deploymentResult.address });
                        } catch (deployError) {
                            logger.error('Deployment failed', { userId, requestId, error: deployError });
                            const errorMessage = sanitizeError(deployError);
                            deploymentResult = {
                                success: false,
                                error: errorMessage
                            };
                        }

                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            type: 'complete',
                            success: true,
                            contractCode: buildResult.contract.code,
                            files: buildResult.files,
                            deployment: deploymentResult,
                            creditsUsed,
                            creditsRemaining: profile.credits - creditsUsed,
                            tokenUsage: buildResult.tokenUsage,
                        })}\\n\\n`));

                        controller.close();
                    } catch (error) {
                        logger.error('Stream error', { userId, requestId, error });
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            type: 'error',
                            message: sanitizeError(error)
                        })}\\n\\n`));
                        controller.close();
                    }
                }
            });

            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'X-RateLimit-Remaining': rateLimit.remaining.toString()
                },
            });
        }

        // Non-streaming mode
        const buildResult = await orchestrator.buildDApp({
            prompt: sanitizedPrompt,
            files,
            useSearch
        });

        if (!buildResult.success || !buildResult.contract) {
            logger.error('Build failed', { userId, requestId, error: buildResult.error });
            return new Response(JSON.stringify({
                success: false,
                error: sanitizeError(buildResult.error)
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const creditsUsed = buildResult.tokenUsage
            ? calculateCredits(buildResult.tokenUsage.inputTokens, buildResult.tokenUsage.outputTokens)
            : 10;

        if (profile.credits < creditsUsed) {
            logger.warn('Insufficient credits', { userId, requestId, required: creditsUsed, available: profile.credits });
            return new Response(JSON.stringify({
                success: false,
                error: `Insufficient credits. Required: ${creditsUsed}, Available: ${profile.credits}`
            }), {
                status: 402,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await supabaseAdmin
            .from('profiles')
            .update({ credits: profile.credits - creditsUsed })
            .eq('id', userId);

        await supabaseAdmin.from('credit_transactions').insert({
            user_id: userId,
            amount: -creditsUsed,
            type: 'deduct',
            description: `dApp generation: "${sanitizedPrompt.substring(0, 50)}..." (${buildResult.tokenUsage?.totalTokens || 0} tokens)`,
        });

        let deploymentResult = null;
        try {
            const { getUserDeployer } = await import('@/lib/deployer');
            const deployer = await getUserDeployer(userId);
            deploymentResult = await deployer.deployContract(buildResult.contract.code);
            logger.info('Deployment successful', { userId, requestId, address: deploymentResult.address });
        } catch (deployError) {
            logger.error('Deployment failed', { userId, requestId, error: deployError });
            deploymentResult = {
                success: false,
                error: sanitizeError(deployError)
            };
        }

        logger.info('Build request completed', { userId, requestId, creditsUsed });

        return new Response(JSON.stringify({
            success: true,
            messages: buildResult.messages,
            contractCode: buildResult.contract.code,
            files: buildResult.files,
            deployment: deploymentResult,
            creditsUsed,
            creditsRemaining: profile.credits - creditsUsed,
            tokenUsage: buildResult.tokenUsage,
        }), {
            headers: {
                'Content-Type': 'application/json',
                'X-RateLimit-Remaining': rateLimit.remaining.toString()
            }
        });

    } catch (error) {
        logger.error('API Error', { requestId, error });
        return new Response(JSON.stringify({
            success: false,
            error: sanitizeError(error)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
