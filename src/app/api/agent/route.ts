import { genesisAgent } from '@/lib/agents/nullshot-agent';
import { CoreMessage } from 'ai';
import { verifyAuth } from '@/lib/auth';
import { AgentMessageSchema, checkRateLimit, sanitizeError } from '@/lib/validation';
import { logger } from '@/lib/logger';

export const runtime = 'edge';

export async function POST(req: Request) {
    const requestId = crypto.randomUUID();

    try {
        // 1. Verify authentication
        const { userId, error: authError } = await verifyAuth(req);

        if (authError || !userId) {
            logger.warn('Unauthorized agent request', { requestId, error: authError });
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 2. Rate limiting (more generous for chat)
        const rateLimit = checkRateLimit(`agent:${userId}`, 30, 60000); // 30 requests per minute

        if (!rateLimit.allowed) {
            logger.warn('Agent rate limit exceeded', { userId, requestId });
            return new Response(JSON.stringify({
                error: 'Rate limit exceeded. Please try again later.'
            }), {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'X-RateLimit-Remaining': rateLimit.remaining.toString()
                }
            });
        }

        // 3. Validate input
        const body = await req.json();
        const validation = AgentMessageSchema.safeParse(body);

        if (!validation.success) {
            logger.warn('Invalid agent request', { userId, requestId, errors: validation.error.issues });
            return new Response(JSON.stringify({
                error: 'Invalid request data'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { messages } = validation.data;

        logger.info('Agent request received', { userId, requestId, messageCount: messages?.length || 0 });

        // Ensure messages is an array
        if (!Array.isArray(messages)) {
            logger.warn('Messages is not an array', { userId, requestId, messages });
            return new Response(JSON.stringify({
                error: 'Messages must be an array'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Convert messages to CoreMessage format - filter out empty messages and ensure proper structure
        const coreMessages: CoreMessage[] = messages
            .filter((msg: { role: string; content: string }) => {
                // Filter out messages with empty or missing content
                return msg && msg.content && typeof msg.content === 'string' && msg.content.trim().length > 0;
            })
            .map((msg: { role: string; content: string }) => ({
                role: msg.role as 'user' | 'assistant' | 'system',
                content: msg.content.trim()
            }));

        // Ensure we have at least one user message
        if (coreMessages.length === 0 || !coreMessages.some(m => m.role === 'user')) {
            logger.warn('No valid messages found', { userId, requestId });
            return new Response(JSON.stringify({
                error: 'No valid messages provided'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const response = await genesisAgent.processMessage(coreMessages);

        // Return the streaming response
        return response;
    } catch (error) {
        logger.error('Agent API error', { requestId, error });
        return new Response(JSON.stringify({
            error: sanitizeError(error)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
