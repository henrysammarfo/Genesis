'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileExplorer } from '@/components/FileExplorer';
import { FileUpload } from '@/components/dashboard/FileUpload';
import { Play, Code2, Send, Terminal, Zap, XCircle, FolderOpen, Cpu, Loader2, Sparkles, Brain, Bot, Rocket, Palette, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

// Real file system from API responses
const initialFiles = {};

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}

interface AgentState {
    name: string;
    status: 'idle' | 'thinking' | 'working' | 'completed';
    message: string;
    icon: any;
    color: string;
}

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [files, setFiles] = useState(initialFiles);
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [view, setView] = useState<'preview' | 'code'>('preview');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'system', content: 'Genesis Online. Describe the dApp you want to build.', timestamp: Date.now() }
    ]);
    const [activeAgent, setActiveAgent] = useState<AgentState | null>(null);
    const [contractCode, setContractCode] = useState<string>('');
    const [deploymentInfo, setDeploymentInfo] = useState<any>(null);
    const [credits, setCredits] = useState<number>(0);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const [useSearch, setUseSearch] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            // Fetch user credits
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('credits')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setCredits(profile.credits || 0);
                }
            }
        }
        getUser();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleExport = async () => {
        if (Object.keys(files).length === 0) return;

        const { exportProject } = await import('@/lib/utils/export');
        await exportProject(files);
    };

    const saveProject = async (name: string) => {
        if (!user) return;

        const { createProject } = await import('@/lib/database/projects');
        const { data, error } = await createProject({
            name,
            prompt: messages.find(m => m.role === 'user')?.content || '',
            contract_code: contractCode,
            contract_address: deploymentInfo?.address,
            transaction_hash: deploymentInfo?.transactionHash,
            files,
            deployment_status: deploymentInfo?.success ? 'deployed' : 'pending',
            credits_used: 0 // Will be updated by API
        });

        if (!error && data) {
            setCurrentProjectId(data.id);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'system',
                content: `✅ Project "${name}" saved successfully!`,
                timestamp: Date.now()
            }]);
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        const newMessage: Message = { id: Date.now().toString(), role: 'user', content: prompt, timestamp: Date.now() };
        setMessages(prev => [...prev, newMessage]);
        const userPrompt = prompt;
        setPrompt('');
        setIsGenerating(true);
        setFiles({});
        setContractCode('');
        setDeploymentInfo(null);

        try {
            // Call real API with Server-Sent Events
            const response = await fetch('/api/build', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userPrompt,
                    stream: true,
                    files: uploadedFiles,
                    useSearch: useSearch
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate dApp');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No response stream');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = JSON.parse(line.slice(6));

                        if (data.type === 'status') {
                            // Update active agent
                            const agentIcons: any = {
                                'architect': Brain,
                                'engineer': Bot,
                                'designer': Palette,
                                'deployer': Rocket
                            };
                            const agentColors: any = {
                                'architect': 'text-purple-400',
                                'engineer': 'text-blue-400',
                                'designer': 'text-pink-400',
                                'deployer': 'text-orange-400'
                            };

                            setActiveAgent({
                                name: data.agent.charAt(0).toUpperCase() + data.agent.slice(1),
                                status: 'working',
                                message: data.message,
                                icon: agentIcons[data.agent] || Cpu,
                                color: agentColors[data.agent] || 'text-white'
                            });
                        } else if (data.type === 'message') {
                            setMessages(prev => [...prev, {
                                id: Date.now().toString(),
                                role: 'assistant',
                                content: data.content,
                                timestamp: data.timestamp
                            }]);
                        } else if (data.type === 'complete') {
                            setActiveAgent(null);
                            setIsGenerating(false);
                            setContractCode(data.contractCode);
                            setFiles(data.files || {});
                            setDeploymentInfo(data.deployment);
                            setActiveFile(Object.keys(data.files || {})[0] || null);

                            // Update credits
                            if (data.creditsRemaining !== undefined) {
                                setCredits(data.creditsRemaining);
                            }

                            // Auto-save project
                            const projectName = `Project-${new Date().toISOString().split('T')[0]}`;
                            await saveProject(projectName);

                            setMessages(prev => [...prev, {
                                id: Date.now().toString(),
                                role: 'assistant',
                                content: `✅ Project generated successfully!\n${data.deployment?.success ? `\n🚀 Deployed to: ${data.deployment.address}` : ''}`,
                                timestamp: Date.now()
                            }]);
                        } else if (data.type === 'error') {
                            setActiveAgent(null);
                            setIsGenerating(false);
                            setMessages(prev => [...prev, {
                                id: Date.now().toString(),
                                role: 'assistant',
                                content: `❌ Error: ${data.message}`,
                                timestamp: Date.now()
                            }]);
                        }
                    }
                }
            }
        } catch (error) {
            setActiveAgent(null);
            setIsGenerating(false);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                timestamp: Date.now()
            }]);
        }
    };

    const hasProject = Object.keys(files).length > 0;

    return (
        <div className="flex flex-col h-screen bg-black text-white overflow-hidden font-sans selection:bg-purple-500/30">
            {/* Header */}
            <header className="h-16 border-b border-white/[0.1] flex items-center justify-between px-6 bg-white/[0.05] backdrop-blur-xl flex-shrink-0 z-50 sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.1]">
                        <Zap className="h-4 w-4 text-purple-500" />
                    </div>
                    <span className="font-semibold text-lg tracking-tight text-white">
                        Genesis
                    </span>
                </div>

                {/* Center Status */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-md">
                    <div className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-white/20'}`} />
                    <span className="text-[11px] font-medium tracking-wide text-white/70 uppercase">
                        {isGenerating ? 'System Active' : 'System Idle'}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    {/* Credits Display */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1]">
                        <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                        <span className="text-sm font-medium text-white">{credits}</span>
                        <span className="text-xs text-white/50">credits</span>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 border-white/[0.1] bg-white/[0.05] text-white/70 hover:bg-white/[0.1] hover:text-white transition-all hover:border-purple-500/30 rounded-lg"
                        onClick={handleExport}
                        disabled={!hasProject}
                    >
                        <Terminal className="mr-2 h-3.5 w-3.5" /> Export
                    </Button>
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="flex-1 flex overflow-hidden z-10">

                {/* Left Column: Explorer */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-72 border-r border-white/[0.1] flex flex-col bg-white/[0.02] backdrop-blur-sm"
                >
                    <div className="h-12 border-b border-white/[0.1] flex items-center px-6 gap-2 bg-white/[0.02]">
                        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Explorer</span>
                    </div>

                    <div className="flex-1 p-2 overflow-auto">
                        {!hasProject ? (
                            <div className="h-full flex flex-col items-center justify-center text-white/30 gap-4 opacity-60">
                                <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/[0.05]">
                                    <FolderOpen className="h-6 w-6 stroke-1" />
                                </div>
                                <span className="text-xs font-medium tracking-wide">NO PROJECT LOADED</span>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="text-[11px] font-medium text-white/50 mb-3 px-4 mt-2 uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles className="h-3 w-3 text-purple-500" />
                                    GENESIS-PROJECT
                                </div>
                                <FileExplorer
                                    files={files}
                                    activeFile={activeFile || ''}
                                    onFileSelect={setActiveFile}
                                />
                            </motion.div>
                        )}
                    </div>

                    {/* Issues Tab */}
                    <div className="p-4 border-t border-white/[0.1] bg-white/[0.02]">
                        <Button variant="destructive" size="sm" className="w-full justify-between text-xs h-9 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all rounded-lg">
                            <span className="flex items-center gap-2"><XCircle className="h-3.5 w-3.5" /> 2 Issues</span>
                            <span className="text-[10px] opacity-70 hover:opacity-100 transition-opacity">×</span>
                        </Button>
                    </div>
                </motion.div>

                {/* Middle Column: Command Center */}
                <div className="w-[550px] border-r border-white/[0.1] flex flex-col bg-white/[0.05] backdrop-blur-md relative">
                    <div className="h-12 border-b border-white/[0.1] flex items-center px-6 gap-2 bg-white/[0.02]">
                        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Command Center</span>
                        <Badge variant="secondary" className="text-[10px] h-5 px-2 bg-blue-500/10 text-blue-400 border-0 font-mono rounded-md">AI-1</Badge>
                    </div>

                    {/* Active Agent Overlay */}
                    <AnimatePresence>
                        {activeAgent && (
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="absolute top-16 left-6 right-6 z-20 bg-[#0A0A0A] border border-purple-500/20 rounded-xl p-4 shadow-2xl backdrop-blur-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-lg bg-white/5 ${activeAgent.color}`}>
                                        <activeAgent.icon className="h-5 w-5 animate-pulse" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className={`text-xs font-bold ${activeAgent.color} uppercase tracking-wider`}>{activeAgent.name}</span>
                                            <Loader2 className="h-3.5 w-3.5 animate-spin text-white/30" />
                                        </div>
                                        <p className="text-sm text-white/70">{activeAgent.message}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Chat Area */}
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-8 pb-24">
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[90%] rounded-2xl p-5 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-white/10 text-white'
                                        : 'bg-white/[0.05] text-white/80 border border-white/[0.05]'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-6 border-t border-white/[0.1] bg-black/80 backdrop-blur-xl absolute bottom-0 left-0 right-0 space-y-3">
                        {/* File Upload and Search Toggle */}
                        <div className="flex items-center justify-between">
                            <FileUpload onFilesSelected={(files) => setUploadedFiles(files)} />

                            <button
                                onClick={() => setUseSearch(!useSearch)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${useSearch
                                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                                    : 'bg-white/[0.05] border-white/[0.1] text-white/50 hover:text-white'
                                    }`}
                            >
                                <Search className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">Web Search</span>
                            </button>
                        </div>

                        {/* Prompt Input */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/50 to-indigo-500/50 rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500 blur opacity-20"></div>
                            <Input
                                className="bg-white/[0.05] border-white/[0.1] text-white pr-12 h-14 rounded-xl focus-visible:ring-0 focus-visible:border-white/20 transition-all placeholder:text-white/30 relative z-10 text-base"
                                placeholder="Describe your dApp..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleGenerate()}
                                disabled={isGenerating}
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute right-2 top-2 h-10 w-10 text-white/50 hover:text-white hover:bg-white/10 transition-colors z-20 rounded-lg"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Live Preview / Code */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex-1 flex flex-col bg-white/[0.02] backdrop-blur-sm"
                >
                    <div className="h-12 border-b border-white/[0.1] flex items-center justify-between px-6 bg-white/[0.02]">
                        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                            {view === 'preview' ? 'Live Preview' : 'Code Editor'}
                        </span>
                        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/[0.1]">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setView('preview')}
                                className={`h-7 px-3 text-[11px] gap-1.5 shadow-sm rounded-md font-medium transition-all ${view === 'preview'
                                    ? 'bg-white/10 text-white'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Play className="h-3 w-3 fill-current" /> Preview
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setView('code')}
                                className={`h-7 px-3 text-[11px] gap-1.5 rounded-md transition-all ${view === 'code'
                                    ? 'bg-white/10 text-white'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Code2 className="h-3 w-3" /> Code
                            </Button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-black relative overflow-hidden shadow-inner">
                        {!hasProject ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 gap-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-purple-500/10 blur-2xl rounded-full animate-pulse" />
                                    <div className="h-20 w-20 rounded-3xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center relative z-10 shadow-2xl backdrop-blur-md">
                                        <Cpu className="h-8 w-8 text-white/40" />
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className="text-sm font-medium text-white/60 tracking-wide">WAITING FOR GENERATION</span>
                                    <span className="text-xs text-white/30">Describe your project to begin</span>
                                </div>
                            </div>
                        ) : (
                            view === 'preview' ? (
                                <motion.iframe
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-full h-full border-0"
                                    title="preview"
                                    srcDoc={`
                                        <style>
                                            body { background: #000; color: #fff; font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                                            .container { text-align: center; }
                                            h1 { color: #4ade80; font-size: 3rem; margin-bottom: 1rem; text-shadow: 0 0 30px rgba(74, 222, 128, 0.3); font-weight: 800; letter-spacing: -1px; }
                                            p { color: #4ade80; font-family: monospace; opacity: 0.8; font-size: 1.1rem; }
                                            .btn { margin-top: 2rem; padding: 0.75rem 1.5rem; background: rgba(74, 222, 128, 0.1); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.2); border-radius: 0.5rem; cursor: pointer; font-family: monospace; transition: all 0.2s; }
                                            .btn:hover { background: rgba(74, 222, 128, 0.2); box-shadow: 0 0 20px rgba(74, 222, 128, 0.2); }
                                        </style>
                                        <div class='container'>
                                            <h1>Genesis Mock App</h1>
                                            <p>Phase 2 Verification Successful</p>
                                            <button class="btn">Open Sandbox</button>
                                        </div>
                                    `}
                                />
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-full h-full p-6 overflow-auto bg-[#0A0A0A]"
                                >
                                    <pre className="font-mono text-sm text-blue-300/90 leading-relaxed">
                                        {activeFile && files[activeFile as keyof typeof files] ? (files[activeFile as keyof typeof files] as any).content : '// No file selected'}
                                    </pre>
                                </motion.div>
                            )
                        )}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
