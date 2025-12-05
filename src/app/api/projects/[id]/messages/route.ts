import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: projectId } = await params;

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

        // Get messages
        const { data: messages, error } = await supabase
            .from('project_messages')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching messages:', error);
            return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
        }

        return NextResponse.json({ messages });
    } catch (error) {
        console.error('Messages GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: projectId } = await params;
        const body = await req.json();
        const { role, content, metadata } = body;

        if (!role || !content) {
            return NextResponse.json({ error: 'Role and content are required' }, { status: 400 });
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

        // Create message
        const { data: message, error } = await supabase
            .from('project_messages')
            .insert({
                project_id: projectId,
                role,
                content,
                metadata: metadata || {}
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating message:', error);
            return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
        }

        // Update project updated_at
        await supabase
            .from('projects')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', projectId);

        return NextResponse.json({ message }, { status: 201 });
    } catch (error) {
        console.error('Messages POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
