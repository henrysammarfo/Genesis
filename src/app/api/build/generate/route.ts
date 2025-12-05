import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAuth } from '@/lib/auth';
import { generateFullStackDApp } from '@/lib/agents/fullstack-generator';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify authentication
    const { userId, error: authError } = await verifyAuth(req);

    if (authError || !userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request
    const body = await req.json();
    const { projectId, planPrompt } = body;

    if (!projectId) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    if (!planPrompt) {
      return NextResponse.json({ success: false, error: 'Plan prompt is required' }, { status: 400 });
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

    // 4. Check user's credits BEFORE making API calls
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    // 5. Estimate credits needed (conservative estimate: 30-50 credits for full generation)
    // We'll calculate actual credits after generation, but deduct upfront to prevent quota abuse
    const estimatedCreditsNeeded = 40; // Conservative estimate

    if (profile.credits < estimatedCreditsNeeded) {
      return NextResponse.json({
        success: false,
        error: `Insufficient credits. Estimated ${estimatedCreditsNeeded} credits needed for full generation. You have ${profile.credits} credits.`
      }, { status: 402 });
    }

    // 6. Deduct credits BEFORE making API calls
    const newCredits = profile.credits - estimatedCreditsNeeded;
    await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', userId);

    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: -estimatedCreditsNeeded,
      type: 'deduct',
      description: `Full-stack dApp generation (estimated) for project ${projectId}`
    });

    // 7. Generate full project code (credits already deducted)
    let fullStackProject;
    try {
      fullStackProject = await generateFullStackDApp(planPrompt);
    } catch (error: any) {
      // If generation fails, refund credits
      await supabase
        .from('profiles')
        .update({ credits: profile.credits })
        .eq('id', userId);
      
      await supabase.from('credit_transactions').insert({
        user_id: userId,
        amount: estimatedCreditsNeeded,
        type: 'refund',
        description: `Refund for failed generation: ${error.message}`
      });

      // Convert quota errors to credit-related messages
      if (error?.message?.includes('quota') || error?.message?.includes('Quota') || error?.message?.includes('exceeded')) {
        throw new Error(`Insufficient credits or API quota limit reached. Please check your credits (you had ${profile.credits}) or wait a moment before trying again.`);
      }

      throw error;
    }

    // 8. Calculate actual credits used (based on complexity)
    const totalFiles =
      fullStackProject.contracts.length +
      fullStackProject.frontend.length +
      fullStackProject.backend.length +
      fullStackProject.config.length;

    const actualCreditsUsed = Math.max(10, Math.ceil(totalFiles * 2));
    
    // Adjust credits if actual usage differs from estimate
    const creditsDifference = actualCreditsUsed - estimatedCreditsNeeded;
    if (creditsDifference !== 0) {
      const finalCredits = newCredits - creditsDifference;
      await supabase
        .from('profiles')
        .update({ credits: finalCredits })
        .eq('id', userId);
      
      if (creditsDifference > 0) {
        // Need to deduct more
        await supabase.from('credit_transactions').insert({
          user_id: userId,
          amount: -creditsDifference,
          type: 'deduct',
          description: `Additional credits for generation (actual usage)`
        });
      } else {
        // Refund excess
        await supabase.from('credit_transactions').insert({
          user_id: userId,
          amount: Math.abs(creditsDifference),
          type: 'refund',
          description: `Refund excess credits (actual usage less than estimate)`
        });
      }
    }

    // 9. Save all generated files to project
    const allFiles = [
      ...fullStackProject.contracts,
      ...fullStackProject.frontend,
      ...fullStackProject.backend,
      ...fullStackProject.config
    ];

    for (const file of allFiles) {
      // Determine type based on path/name
      let fileType = 'other';
      if (file.path.includes('contracts') || file.name.endsWith('.sol')) {
        fileType = 'contract';
      } else if (file.path.includes('frontend') || file.name.endsWith('.tsx') || file.name.endsWith('.ts') || file.name.endsWith('.jsx') || file.name.endsWith('.js')) {
        fileType = 'frontend';
      } else if (file.path.includes('backend') || file.path.includes('api')) {
        fileType = 'backend';
      } else if (file.name.endsWith('.json') || file.name.endsWith('.config.js')) {
        fileType = 'config';
      }

      await supabase.from('project_files').insert({
        project_id: projectId,
        name: file.name,
        path: file.path,
        content: file.content,
        type: fileType,
        language: file.language,
        size_bytes: file.content.length
      });
    }

    // 10. Save README
    await supabase.from('project_files').insert({
      project_id: projectId,
      name: 'README.md',
      path: 'README.md',
      content: fullStackProject.readme,
      type: 'documentation',
      language: 'markdown',
      size_bytes: fullStackProject.readme.length
    });

    // 10. Save completion message
    await supabase.from('project_messages').insert({
      project_id: projectId,
      role: 'assistant',
      content: `✅ Successfully generated ${totalFiles} files! All code is ready in the Explorer panel.`,
      metadata: { type: 'completion', filesGenerated: totalFiles }
    });

    // 11. Return success
    // Get final credits
    const { data: finalProfile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    return NextResponse.json({
      success: true,
      project: fullStackProject,
      creditsUsed: actualCreditsUsed,
      creditsRemaining: finalProfile?.credits || newCredits,
      filesGenerated: totalFiles,
      message: 'Full-stack dApp generated successfully!'
    });

  } catch (error: any) {
    console.error('Generate API error:', error);
    
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

