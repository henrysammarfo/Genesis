'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Eye, EyeOff } from 'lucide-react';

interface EnvVar {
    id: string;
    key: string;
    value: string;
}

export function EnvManager() {
    const [envVars, setEnvVars] = useState<EnvVar[]>([]);
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [showValues, setShowValues] = useState<{ [key: string]: boolean }>({});

    const fetchEnvVars = async () => {
        try {
            const response = await fetch('/api/env');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setEnvVars(data.envVars || []);
        } catch (error) {
            console.error('Error fetching env vars:', error);
        }
    };

    const addEnvVar = async () => {
        if (!newKey || !newValue) return;

        try {
            setLoading(true);
            const response = await fetch('/api/env', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: newKey, value: newValue })
            });

            if (!response.ok) throw new Error('Failed to add');

            await fetchEnvVars();
            setNewKey('');
            setNewValue('');
        } catch (error) {
            console.error('Error adding env var:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteEnvVar = async (key: string) => {
        try {
            const response = await fetch(`/api/env?key=${encodeURIComponent(key)}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete');

            await fetchEnvVars();
        } catch (error) {
            console.error('Error deleting env var:', error);
        }
    };

    const toggleShowValue = (key: string) => {
        setShowValues(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
                <CardDescription>
                    Manage your API keys and environment variables securely
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add new env var */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Key</Label>
                        <Input
                            placeholder="GEMINI_API_KEY"
                            value={newKey}
                            onChange={(e) => setNewKey(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Value</Label>
                        <div className="flex gap-2">
                            <Input
                                type="password"
                                placeholder="Your API key"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                            />
                            <Button onClick={addEnvVar} disabled={loading}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* List existing env vars */}
                <div className="space-y-2">
                    {envVars.map((envVar) => (
                        <div key={envVar.id} className="flex items-center gap-2 p-2 border rounded">
                            <div className="flex-1">
                                <div className="font-mono text-sm">{envVar.key}</div>
                                <div className="text-xs text-muted-foreground font-mono">
                                    {showValues[envVar.key] ? envVar.value : '••••••••••••'}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleShowValue(envVar.key)}
                            >
                                {showValues[envVar.key] ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteEnvVar(envVar.key)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                {envVars.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        No environment variables set. Add one above to get started.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
