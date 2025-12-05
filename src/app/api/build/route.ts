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

    // 4. Check user's credits BEFORE making any API calls
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (!profile) {
      return NextResponse.json({
        success: false,
        error: 'Profile not found'
      }, { status: 404 });
    }

    // Calculate credits needed for plan generation (estimate: 5 credits)
    const planCreditsNeeded = 5;
    
    if (profile.credits < planCreditsNeeded) {
      return NextResponse.json({
        success: false,
        error: `Insufficient credits. You need at least ${planCreditsNeeded} credits to generate a plan. You have ${profile.credits} credits.`
      }, { status: 402 });
    }

    // 5. Deduct credits BEFORE making API calls
    const newCredits = profile.credits - planCreditsNeeded;
    await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', userId);

    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: -planCreditsNeeded,
      type: 'deduct',
      description: `Plan generation for project ${projectId}`
    });

    // 6. Web search if requested (only if user has enough credits)
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

    // 7. Generate plan (credits already deducted)
    const planPrompt = searchContext
      ? `${prompt}\n\nContext from web search:\n${searchContext}`
      : prompt;

    let plan: string;
    try {
      plan = await generatePlan(planPrompt);
    } catch (error: any) {
      // If plan generation fails, refund credits
      await supabase
        .from('profiles')
        .update({ credits: profile.credits })
        .eq('id', userId);
      
      await supabase.from('credit_transactions').insert({
        user_id: userId,
        amount: planCreditsNeeded,
        type: 'refund',
        description: `Refund for failed plan generation: ${error.message}`
      });

      // Convert quota errors to credit-related messages
      if (error?.message?.includes('quota') || error?.message?.includes('Quota') || error?.message?.includes('exceeded')) {
        throw new Error(`Insufficient credits or API quota limit reached. Please check your credits (you have ${profile.credits}) or wait a moment before trying again.`);
      }

      throw error;
    }

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

    // 8. Estimate credits needed for full generation (based on plan complexity)
    // Estimate: 10-50 credits depending on complexity
    const estimatedGenerationCredits = Math.min(50, Math.max(10, Math.ceil(plan.length / 100) * 5));
    const totalCreditsNeeded = planCreditsNeeded + estimatedGenerationCredits;

    // 9. Return plan and indicate if ENV keys are needed
    return NextResponse.json({
      success: true,
      plan: plan,
      planGenerated: true,
      planPrompt: planPrompt, // Store for code generation
      requiresApproval: true,
      needsEnvKeys: !hasEnvKeys,
      creditsUsed: planCreditsNeeded,
      creditsRemaining: newCredits,
      estimatedGenerationCredits: estimatedGenerationCredits,
      totalCreditsNeeded: totalCreditsNeeded,
      message: hasEnvKeys 
        ? `Plan generated! (Used ${planCreditsNeeded} credits, ${newCredits} remaining). Estimated ${estimatedGenerationCredits} credits needed for generation. Please review and approve to continue.`
        : `Plan generated! (Used ${planCreditsNeeded} credits, ${newCredits} remaining). Before generating code, please configure your environment variables (API keys) in Settings.`
    });

  } catch (error: any) {
    console.error('Build API error:', error);
    
    // Convert quota/API errors to user-friendly credit messages
    let errorMessage = error.message || 'Internal server error';
    
    if (errorMessage.includes('quota') || errorMessage.includes('Quota') || errorMessage.includes('exceeded')) {
      errorMessage = 'Insufficient credits or API limit reached. Please check your credits or wait before trying again.';
    } else if (errorMessage.includes('API key')) {
      errorMessage = 'API configuration error. Please check your environment variables.';
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}
