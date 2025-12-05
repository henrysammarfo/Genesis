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
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('updated_at', { ascending: false });

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

        // ENSURE PROFILE EXISTS - Auto-create if missing
        console.log('🔵 Checking if profile exists...');
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

        if (!existingProfile) {
            console.log('🟡 Profile not found, creating...');
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    email: user.email,
                    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                    credits: 100
                });

            if (profileError) {
                console.error('🔴 Failed to create profile:', profileError);
                return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
            }
            console.log('✅ Profile created successfully');
        } else {
            console.log('✅ Profile exists');
        }

        const body = await req.json();
        const { name, description } = body;
        console.log('🔵 Request body:', { name, description });

        if (!name) {
            return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
        }

        // Create new project
        console.log('🔵 Attempting to insert project...');
        const { data: project, error } = await supabase
            .from('projects')
            .insert({
                user_id: user.id,
                name,
                description: description || '',
                status: 'active'
            })
            .select()
            .single();

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
