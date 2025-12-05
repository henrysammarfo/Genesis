/**
 * Dashboard Integration Utilities
 * Connects dashboard to real Supabase data - NO MOCK DATA
 */

import { supabase } from '@/lib/supabase/client';

export interface DashboardProject {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface DashboardMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    metadata: any;
    created_at: string;
}

export interface DashboardFile {
    id: string;
    name: string;
    path: string;
    content: string;
    type: string;
    language?: string;
    created_at: string;
}

/**
 * Fetch user's credits from Supabase
 */
export async function fetchUserCredits(): Promise<number> {

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

    return profile?.credits || 0;
}

/**
 * Fetch all projects for current user
 */
export async function fetchProjects(): Promise<DashboardProject[]> {

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('updated_at', { ascending: false });

    return projects || [];
}

/**
 * Fetch messages for a specific project
 */
export async function fetchProjectMessages(projectId: string): Promise<DashboardMessage[]> {

    const { data: messages } = await supabase
        .from('project_messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

    return messages || [];
}

/**
 * Fetch files for a specific project
 */
export async function fetchProjectFiles(projectId: string): Promise<DashboardFile[]> {

    const { data: files } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

    return files || [];
}

/**
 * Create a new project
 */
export async function createProject(name: string, description?: string): Promise<DashboardProject | null> {

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: project } = await supabase
        .from('projects')
        .insert({
            user_id: user.id,
            name,
            description: description || '',
            status: 'active'
        })
        .select()
        .single();

    return project;
}

/**
 * Add a message to a project
 */
export async function addProjectMessage(
    projectId: string,
    role: 'user' | 'assistant',
    content: string,
    metadata?: any
): Promise<DashboardMessage | null> {

    const { data: message } = await supabase
        .from('project_messages')
        .insert({
            project_id: projectId,
            role,
            content,
            metadata: metadata || {}
        })
        .select()
        .single();

    // Update project's updated_at
    await supabase
        .from('projects')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', projectId);

    return message;
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<boolean> {

    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

    return !error;
}

/**
 * Subscribe to real-time credit updates
 */
export function subscribeToCredits(userId: string, callback: (credits: number) => void) {

    const channel = supabase
        .channel('credits-changes')
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
                filter: `id=eq.${userId}`
            },
            (payload) => {
                callback(payload.new.credits);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

/**
 * Subscribe to real-time project file updates
 */
export function subscribeToProjectFiles(projectId: string, callback: (files: DashboardFile[]) => void) {

    const channel = supabase
        .channel(`project-files-${projectId}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'project_files',
                filter: `project_id=eq.${projectId}`
            },
            async () => {
                // Refetch all files when any change occurs
                const files = await fetchProjectFiles(projectId);
                callback(files);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}
