import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const projectId = formData.get('projectId') as string;
        const type = formData.get('type') as string; // 'document' or 'image'

        if (!file || !projectId || !type) {
            return NextResponse.json({
                error: 'File, projectId, and type are required'
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

        // Upload to Supabase Storage
        const fileName = `${user.id}/${projectId}/${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('uploads')
            .upload(fileName, file);

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('uploads')
            .getPublicUrl(fileName);

        // Save to database
        const { data: upload, error: dbError } = await supabase
            .from('project_uploads')
            .insert({
                project_id: projectId,
                name: file.name,
                type,
                mime_type: file.type,
                size_bytes: file.size,
                storage_path: fileName,
                url: publicUrl
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
            return NextResponse.json({ error: 'Failed to save upload' }, { status: 500 });
        }

        // Process file content for AI context
        let content = '';
        if (type === 'document' && (file.type === 'text/plain' || file.name.endsWith('.txt'))) {
            content = await file.text();
        }

        return NextResponse.json({
            upload,
            content: content || null
        }, { status: 201 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
