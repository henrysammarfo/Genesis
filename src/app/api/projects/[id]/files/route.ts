import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const projectId = params.id;

        // Verify project ownership
        const { data: project } = await supabase
            .from('projects')
            .select('id')
            .eq('id', projectId)
            .eq('user_id', user.id)
            .single();

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Get files
        const { data: files, error } = await supabase
            .from('project_files')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching files:', error);
            return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
        }

        return NextResponse.json({ files });
    } catch (error) {
        console.error('Files GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const projectId = params.id;
        const body = await req.json();
        const { name, path, content, type, language, metadata } = body;

        if (!name || !path || !content || !type) {
            return NextResponse.json({
                error: 'Name, path, content, and type are required'
            }, { status: 400 });
        }

        // Verify project ownership
        const { data: project } = await supabase
            .from('projects')
            .select('id')
            .eq('id', projectId)
            .eq('user_id', user.id)
            .single();

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Create file
        const { data: file, error } = await supabase
            .from('project_files')
            .insert({
                project_id: projectId,
                name,
                path,
                content,
                type,
                language: language || null,
                size_bytes: content.length,
                metadata: metadata || {}
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating file:', error);
            return NextResponse.json({ error: 'Failed to create file' }, { status: 500 });
        }

        return NextResponse.json({ file }, { status: 201 });
    } catch (error) {
        console.error('Files POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
