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

    // 4. Check user's credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    // 5. Generate full project code
    const fullStackProject = await generateFullStackDApp(planPrompt);

    // 6. Calculate credits (based on complexity)
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

    // 7. Deduct credits
    await supabase
      .from('profiles')
      .update({ credits: profile.credits - creditsUsed })
      .eq('id', userId);

    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: -creditsUsed,
      type: 'deduct',
      description: `Full-stack dApp generation for project ${projectId}`
    });

    // 8. Save all generated files to project
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

    // 9. Save README
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
    return NextResponse.json({
      success: true,
      project: fullStackProject,
      creditsUsed,
      creditsRemaining: profile.credits - creditsUsed,
      filesGenerated: totalFiles,
      message: 'Full-stack dApp generated successfully!'
    });

  } catch (error: any) {
    console.error('Generate API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

