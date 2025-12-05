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

    // 7. Check if user has ENV keys configured
    const { data: envVars } = await supabase
      .from('user_env_vars')
      .select('key')
      .eq('user_id', userId)
      .limit(1);

    const hasEnvKeys = envVars && envVars.length > 0;

    // 8. Return plan and indicate if ENV keys are needed
    return NextResponse.json({
      success: true,
      plan: plan,
      planGenerated: true,
      planPrompt: planPrompt, // Store for code generation
      requiresApproval: true,
      needsEnvKeys: !hasEnvKeys,
      message: hasEnvKeys 
        ? 'Plan generated! Please review and approve to continue with code generation.'
        : 'Plan generated! Before generating code, please configure your environment variables (API keys) in Settings.'
    });

  } catch (error: any) {
    console.error('Build API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
