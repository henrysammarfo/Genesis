'use client';

import { useState, useEffect } from 'react';
import { useProjects, type Project } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Folder, Trash2, Loader2 } from 'lucide-react';

interface ProjectSwitcherProps {
    onProjectSelect: (projectId: string) => void;
    currentProjectId: string | null;
}

export function ProjectSwitcher({ onProjectSelect, currentProjectId }: ProjectSwitcherProps) {
    const { projects, loading, createProject, deleteProject } = useProjects();
    const [showNewProject, setShowNewProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [creating, setCreating] = useState(false);

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) return;

        try {
            setCreating(true);
            const project = await createProject(newProjectName, '');
            setNewProjectName('');
            setShowNewProject(false);
            if (project) {
                onProjectSelect(project.id);
            }
        } catch (error) {
            console.error('Failed to create project:', error);
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            await deleteProject(projectId);
            if (currentProjectId === projectId) {
                // Select first available project or null
                const remaining = projects.filter(p => p.id !== projectId);
                onProjectSelect(remaining[0]?.id || '');
            }
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    };

    if (loading) {
        return (
            <div className="p-4 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between px-2">
                <span className="text-sm font-semibold text-gray-300">Projects</span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewProject(!showNewProject)}
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            {showNewProject && (
                <div className="px-2 space-y-2">
                    <Input
                        placeholder="Project name..."
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                        autoFocus
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    />
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={handleCreateProject}
                            disabled={creating || !newProjectName.trim()}
                            className="flex-1"
                        >
                            {creating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Create'}
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setShowNewProject(false);
                                setNewProjectName('');
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            <div className="space-y-1">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className={`
              flex items-center justify-between px-2 py-2 rounded cursor-pointer
              hover:bg-gray-800 transition-colors group
              ${currentProjectId === project.id ? 'bg-gray-800 border-l-2 border-purple-500' : ''}
            `}
                        onClick={() => onProjectSelect(project.id)}
                    >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Folder className="w-4 h-4 flex-shrink-0 text-gray-400" />
                            <span className="text-sm truncate text-gray-300">{project.name}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleDeleteProject(project.id, e)}
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>
                ))}
            </div>

            {projects.length === 0 && !showNewProject && (
                <div className="px-2 py-4 text-center text-sm text-gray-500">
                    No projects yet. Click + to create one.
                </div>
            )}
        </div>
    );
}
