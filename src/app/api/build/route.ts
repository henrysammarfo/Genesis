import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAuth } from '@/lib/auth';
import { generateFullStackDApp, generatePlan } from '@/lib/agents/fullstack-generator';
import { tavily } from '@tavily/core';

const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY || '' });

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    // 1. Verify authentication
    const { userId, error: authError } = await verifyAuth(req);

    if (authError || !userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request
    const body = await req.json();
    const { prompt, projectId, stream = false, useSearch = false } = body;

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    if (!projectId) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // 3. Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    // 4. Check user's credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (!profile || profile.credits < 10) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient credits. You need at least 10 credits.'
      }, { status: 402 });
    }

    // 5. Web search if requested
    let searchContext = '';
    if (useSearch && process.env.TAVILY_API_KEY) {
      try {
        const searchResults = await tavilyClient.search(prompt, {
          searchDepth: 'basic',
          maxResults: 3
        });
        searchContext = searchResults.results
          .map(r => `${r.title}: ${r.content}`)
          .join('\n\n');
      } catch (error) {
        console.error('Search error:', error);
      }
    }

    // 6. Generate plan first
    const planPrompt = searchContext
      ? `${prompt}\n\nContext from web search:\n${searchContext}`
      : prompt;

    const plan = await generatePlan(planPrompt);

    // Save plan as a message
    await supabase.from('project_messages').insert({
      project_id: projectId,
      role: 'assistant',
      content: plan,
      metadata: { type: 'plan', searchUsed: useSearch }
    });

    // 7. If streaming, return plan and wait for approval
    if (stream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // Send plan
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'plan',
            content: plan
          })}\n\n`));

          controller.close();
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // 8. Non-streaming: generate full project
    const fullStackProject = await generateFullStackDApp(planPrompt);

    // 9. Calculate credits (based on complexity)
    const totalFiles =
      fullStackProject.contracts.length +
      fullStackProject.frontend.length +
      fullStackProject.backend.length +
      fullStackProject.config.length;

    const creditsUsed = Math.max(10, Math.ceil(totalFiles * 2));

    if (profile.credits < creditsUsed) {
      return NextResponse.json({
        success: false,
        error: `Insufficient credits. Required: ${creditsUsed}, Available: ${profile.credits}`
      }, { status: 402 });
    }

    // 10. Deduct credits
    await supabase
      .from('profiles')
      .update({ credits: profile.credits - creditsUsed })
      .eq('id', userId);

    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: -creditsUsed,
      type: 'deduct',
      description: `Full-stack dApp generation: "${prompt.substring(0, 50)}..."`
    });

    // 11. Save all generated files to project
    const allFiles = [
      ...fullStackProject.contracts,
      ...fullStackProject.frontend,
      ...fullStackProject.backend,
      ...fullStackProject.config
    ];

    for (const file of allFiles) {
      await supabase.from('project_files').insert({
        project_id: projectId,
        name: file.name,
        path: file.path,
        content: file.content,
        type: file.type || 'other',
        language: file.language,
        size_bytes: file.content.length
      });
    }

    // 12. Save README
    await supabase.from('project_files').insert({
      project_id: projectId,
      name: 'README.md',
      path: 'README.md',
      content: fullStackProject.readme,
      type: 'documentation',
      language: 'markdown',
      size_bytes: fullStackProject.readme.length
    });

    // 13. Return success
    return NextResponse.json({
      success: true,
      project: fullStackProject,
      creditsUsed,
      creditsRemaining: profile.credits - creditsUsed,
      message: 'Full-stack dApp generated successfully!'
    });

  } catch (error: any) {
    console.error('Build API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
