import { supabase } from '@/lib/supabase/client';

export interface Project {
    id: string;
    user_id: string;
    name: string;
    prompt: string;
    contract_code?: string;
    contract_address?: string;
    transaction_hash?: string;
    files?: Record<string, any>;
    deployment_status: 'pending' | 'deployed' | 'failed';
    credits_used: number;
    created_at: string;
    updated_at: string;
}

export async function createProject(data: {
    name: string;
    prompt: string;
    contract_code?: string;
    contract_address?: string;
    transaction_hash?: string;
    files?: Record<string, any>;
    deployment_status?: string;
    credits_used?: number;
}): Promise<{ data: Project | null; error: any }> {
    return await supabase
        .from('projects')
        .insert([data])
        .select()
        .single();
}

export async function getUserProjects(userId: string): Promise<{ data: Project[] | null; error: any }> {
    return await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
}

export async function getProject(id: string): Promise<{ data: Project | null; error: any }> {
    return await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<{ data: Project | null; error: any }> {
    return await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
}

export async function deleteProject(id: string): Promise<{ error: any }> {
    return await supabase
        .from('projects')
        .delete()
        .eq('id', id);
}
