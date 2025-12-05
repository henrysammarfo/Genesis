import { useState, useEffect } from 'react';

export interface Project {
    id: string;
    user_id: string;
    name: string;
    description: string;
    status: string;
    metadata: any;
    created_at: string;
    updated_at: string;
}

export interface Message {
    id: string;
    project_id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    metadata: any;
    created_at: string;
}

export interface ProjectFile {
    id: string;
    project_id: string;
    name: string;
    path: string;
    content: string;
    type: string;
    language?: string;
    size_bytes?: number;
    metadata: any;
    created_at: string;
    updated_at: string;
}

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/projects');
            if (!response.ok) throw new Error('Failed to fetch projects');
            const data = await response.json();
            setProjects(data.projects || []);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createProject = async (name: string, description?: string) => {
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            });
            if (!response.ok) throw new Error('Failed to create project');
            const data = await response.json();
            setProjects(prev => [data.project, ...prev]);
            return data.project;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteProject = async (projectId: string) => {
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete project');
            setProjects(prev => prev.filter(p => p.id !== projectId));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return {
        projects,
        loading,
        error,
        createProject,
        deleteProject,
        refetch: fetchProjects
    };
}

export function useProjectMessages(projectId: string | null) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchMessages = async () => {
        if (!projectId) return;
        try {
            setLoading(true);
            const response = await fetch(`/api/projects/${projectId}/messages`);
            if (!response.ok) throw new Error('Failed to fetch messages');
            const data = await response.json();
            setMessages(data.messages || []);
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const addMessage = async (role: 'user' | 'assistant', content: string, metadata?: any) => {
        if (!projectId) return;
        try {
            const response = await fetch(`/api/projects/${projectId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, content, metadata })
            });
            if (!response.ok) throw new Error('Failed to add message');
            const data = await response.json();
            setMessages(prev => [...prev, data.message]);
            return data.message;
        } catch (err) {
            console.error('Error adding message:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [projectId]);

    return {
        messages,
        loading,
        addMessage,
        refetch: fetchMessages
    };
}

export function useProjectFiles(projectId: string | null) {
    const [files, setFiles] = useState<ProjectFile[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchFiles = async () => {
        if (!projectId) return;
        try {
            setLoading(true);
            const response = await fetch(`/api/projects/${projectId}/files`);
            if (!response.ok) throw new Error('Failed to fetch files');
            const data = await response.json();
            setFiles(data.files || []);
        } catch (err) {
            console.error('Error fetching files:', err);
        } finally {
            setLoading(false);
        }
    };

    const addFile = async (file: Omit<ProjectFile, 'id' | 'project_id' | 'created_at' | 'updated_at'>) => {
        if (!projectId) return;
        try {
            const response = await fetch(`/api/projects/${projectId}/files`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(file)
            });
            if (!response.ok) throw new Error('Failed to add file');
            const data = await response.json();
            setFiles(prev => [...prev, data.file]);
            return data.file;
        } catch (err) {
            console.error('Error adding file:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [projectId]);

    return {
        files,
        loading,
        addFile,
        refetch: fetchFiles
    };
}
