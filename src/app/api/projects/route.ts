import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get all projects for user
        // Try with status filter first, if it fails (column doesn't exist), try without it
        let { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('updated_at', { ascending: false });
        
        // If error about status column, retry without status filter
        if (error && (error.message?.includes('column') || error.message?.includes('status'))) {
            const retryResult = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false });
            projects = retryResult.data;
            error = retryResult.error;
            
            // Filter by status in memory if status column exists
            if (projects && projects.length > 0 && projects[0]?.status !== undefined) {
                projects = projects.filter(p => !p.status || p.status === 'active');
            }
        }

        if (error) {
            console.error('Error fetching projects:', error);
            return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
        }

        return NextResponse.json({ projects });
    } catch (error) {
        console.error('Projects GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        console.log('🔵 POST /api/projects - Starting...');
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        console.log('🔵 User auth result:', { user: user?.id, authError: authError?.message });

        if (authError || !user) {
            console.log('🔴 Auth failed:', authError);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // FORCE PROFILE CREATION using admin client (bypasses RLS)
        console.log('🔵 Force creating profile with admin client...');
        const { supabaseAdmin } = await import('@/lib/supabase/server');

        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                credits: 100
            }, {
                onConflict: 'id'
            });

        if (profileError) {
            console.error('🔴 Failed to upsert profile:', profileError);
        } else {
            console.log('✅ Profile upserted successfully');
        }

        const body = await req.json();
        const { name, description } = body;
        console.log('🔵 Request body:', { name, description });

        if (!name) {
            return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
        }

        // Create new project using ADMIN CLIENT (bypasses RLS)
        console.log('🔵 Attempting to insert project with admin client...');
        
        // Try with description/status first (newer schema), then fall back to prompt (older schema)
        let projectData: any = {
            user_id: user.id,
            name,
            description: description || '',
            status: 'active'
        };
        
        let { data: project, error } = await supabaseAdmin
            .from('projects')
            .insert(projectData)
            .select()
            .single();
        
        // If that fails, try with prompt instead (older schema compatibility)
        if (error && error.message?.includes('column') && error.message?.includes('description')) {
            console.log('🔵 Retrying with prompt field (older schema)...');
            projectData = {
                user_id: user.id,
                name,
                prompt: description || '',
                status: 'active'
            };
            
            const retryResult = await supabaseAdmin
                .from('projects')
                .insert(projectData)
                .select()
                .single();
                
            project = retryResult.data;
            error = retryResult.error;
        }

        if (error) {
            console.error('🔴 Error creating project:', error);
            console.error('🔴 Error details:', JSON.stringify(error, null, 2));
            return NextResponse.json({ error: `Failed to create project: ${error.message}` }, { status: 500 });
        }

        console.log('✅ Project created successfully:', project.id);
        return NextResponse.json({ project }, { status: 201 });
    } catch (error: any) {
        console.error('🔴 Projects POST error:', error);
        console.error('🔴 Error stack:', error.stack);
        return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 });
    }
}
