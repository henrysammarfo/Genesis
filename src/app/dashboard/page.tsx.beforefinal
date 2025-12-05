"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sparkles,
  Folder,
  FileCode,
  Send,
  Code,
  Play,
  Settings,
  LogOut,
  X,
  AlertCircle,
  Loader2,
  Zap,
  Shield,
  Upload,
  Image as ImageIcon,
  FileText,
  Coins,
  User,
  Menu,
  X as CloseIcon,
  CheckCircle2,
  Clock,
  Trash2,
  Key,
  FileEdit
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { ProjectSwitcher } from "@/components/dashboard/ProjectSwitcher"
import { useProjects, useProjectMessages, useProjectFiles } from "@/hooks/useProjects"

interface ProjectFile {
  name: string
  type: 'file' | 'folder'
  content?: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

interface Plan {
  steps: string[]
  components: string[]
  estimatedTime: string
}

export default function Dashboard() {
  const router = useRouter()
  const [currentProjectId, setCurrentProjectId] = useState<string>("")
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Genesis Online. Describe the dApp you want to build.', timestamp: new Date() }
  ])
  const [isGenerating, setIsGenerating] = useState(false)
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<'preview' | 'code'>('preview')
  const [status, setStatus] = useState<'IDLE' | 'PLANNING' | 'GENERATING' | 'COMPLETE'>('IDLE')
  const [generatedCode, setGeneratedCode] = useState<string>("")
  const [streamingText, setStreamingText] = useState("")
  const [credits, setCredits] = useState(0) // Real credits from DB
  const [userProfile, setUserProfile] = useState<{ name: string, email: string } | null>(null)
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)
  const [showPlan, setShowPlan] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch real user data from database
  useEffect(() => {
    async function fetchUserData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits, full_name, email')
          .eq('id', user.id)
          .single()

        if (profile) {
          setCredits(profile.credits || 0)
          setUserProfile({
            name: profile.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: profile.email || user.email || ''
          })
        }
      }
    }
    fetchUserData()
  }, [])

  // Load project files and messages when project is selected
  useEffect(() => {
    async function loadProjectData() {
      if (!currentProjectId) {
        setProjectFiles([])
        setMessages([{ role: 'assistant', content: 'Create or select a project to get started!', timestamp: new Date() }])
        return
      }

      // Load files from database
      const { data: files } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', currentProjectId)
        .order('created_at', { ascending: true })

      if (files && files.length > 0) {
        setProjectFiles(files.map(f => ({
          name: f.name,
          type: 'file' as const,
          content: f.content
        })))
        setSelectedFile(files[0].name)
        setGeneratedCode(files[0].content)
      } else {
        setProjectFiles([])
      }

      // Load messages from database
      const { data: msgs } = await supabase
        .from('project_messages')
        .select('*')
        .eq('project_id', currentProjectId)
        .order('created_at', { ascending: true })

      if (msgs && msgs.length > 0) {
        setMessages(msgs.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: new Date(m.created_at)
        })))
      } else {
        setMessages([{ role: 'assistant', content: 'Genesis Online. Describe the dApp you want to build.', timestamp: new Date() }])
      }
    }
    loadProjectData()
  }, [currentProjectId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const docs = files.filter(f => f.type === 'application/pdf' || f.type === 'text/plain')
    const images = files.filter(f => f.type.startsWith('image/'))
    setUploadedDocuments(prev => [...prev, ...docs])
    setUploadedImages(prev => [...prev, ...images])
  }

  const deleteFile = (fileName: string) => {
    setProjectFiles(prev => prev.filter(f => f.name !== fileName))
    if (selectedFile === fileName) {
      setSelectedFile(null)
      setGeneratedCode("")
    }
  }

  const isSimpleChat = (text: string): boolean => {
    const simplePatterns = [/^hi\s*$/i, /^hello\s*$/i, /^hey\s*$/i, /^thanks?\s*$/i, /^thank you\s*$/i, /^\?$/]
    return simplePatterns.some(pattern => pattern.test(text.trim()))
  }

  const handleSend = async () => {
    if (!prompt.trim() || isGenerating) return

    const userMessage = prompt.trim()
    setPrompt("")
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }])

    // Check if it's simple chat
    if (isSimpleChat(userMessage)) {
      setIsGenerating(true)
      setTimeout(() => {
        const responses: { [key: string]: string } = {
          'hi': 'Hello! How can I help you build your dApp today?',
          'hello': 'Hi there! Ready to create something amazing?',
          'hey': 'Hey! What would you like to build?',
          'thanks': 'You\'re welcome! Happy building! 🚀',
          'thank you': 'You\'re welcome! Happy building! 🚀',
          '?': 'I\'m here to help you build dApps! Describe what you want to create.'
        }
        const response = responses[userMessage.toLowerCase()] || 'Hello! How can I help you?'
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response,
          timestamp: new Date()
        }])
        setIsGenerating(false)
      }, 500)
      return
    }

    // Check if it's a dApp description - show plan first
    const isdAppDescription = userMessage.length > 20 ||
      userMessage.toLowerCase().includes('create') ||
      userMessage.toLowerCase().includes('build') ||
      userMessage.toLowerCase().includes('contract') ||
      userMessage.toLowerCase().includes('dapp') ||
      userMessage.toLowerCase().includes('app')

    if (isdAppDescription && !showPlan) {
      setIsGenerating(true)
      setStatus('PLANNING')

      // Generate plan
      setTimeout(() => {
        const plan: Plan = {
          steps: [
            'Set up environment and project structure',
            'Configure EMV key and blockchain settings',
            'Create smart contract architecture',
            'Design front-end interface',
            'Set up back-end integration',
            'Create API endpoints',
            'Write documentation',
            'Set up testing framework'
          ],
          components: ['Smart Contracts', 'Frontend UI', 'Backend API', 'Integration Layer', 'Documentation'],
          estimatedTime: '15-20 minutes'
        }
        setCurrentPlan(plan)
        setShowPlan(true)
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I\'ve created a development plan for your dApp. Please review it below and let me know if you\'d like any changes.',
          timestamp: new Date()
        }])
        setIsGenerating(false)
        setStatus('IDLE')
      }, 2000)
      return
    }

    // If plan is approved or it's a tweak, start generation
    if (showPlan && (userMessage.toLowerCase().includes('yes') || userMessage.toLowerCase().includes('approve') || userMessage.toLowerCase().includes('start'))) {
      setIsGenerating(true)
      setStatus('GENERATING')
      setShowPlan(false)
      setStreamingText("")
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Perfect! Starting the build process...',
        timestamp: new Date()
      }])

      try {
        const response = await fetch('/api/build', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: userMessage,
            stream: true,
            documents: uploadedDocuments.map(f => f.name),
            images: uploadedImages.map(f => f.name)
          })
        })

        if (!response.ok) {
          throw new Error('Generation failed')
        }

        // Handle streaming response
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (reader) {
          let fullText = ""
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n').filter(line => line.trim())

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6))
                  if (data.content) {
                    fullText += data.content
                    setStreamingText(fullText)
                  }
                  if (data.done) {
                    break
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }

          setMessages(prev => [...prev, {
            role: 'assistant',
            content: fullText || "Contract generated successfully. Check the Explorer panel for generated files.",
            timestamp: new Date()
          }])
          setStreamingText("")

          // Update project files
          if (fullText.includes('pragma solidity')) {
            const newFile: ProjectFile = {
              name: `GeneratedContract_${Date.now()}.sol`,
              type: 'file',
              content: fullText
            }
            setProjectFiles(prev => [...prev, newFile])
            setSelectedFile(newFile.name)
            setGeneratedCode(fullText)
            setCredits(prev => Math.max(0, prev - 10))
          }
        }

        setStatus('COMPLETE')
      } catch (error) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, there was an error generating your contract. Please try again.',
          timestamp: new Date()
        }])
        setStatus('IDLE')
      } finally {
        setIsGenerating(false)
      }
      return
    }

    // Handle tweaks to plan
    if (showPlan) {
      setIsGenerating(true)
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I\'ve updated the plan based on your feedback. Should I proceed with building?',
          timestamp: new Date()
        }])
        setIsGenerating(false)
      }, 1000)
      return
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const selectedFileContent = projectFiles.find(f => f.name === selectedFile)?.content || ""

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0f0f0f] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Zap className="h-5 w-5 text-purple-500" />
            <span className="text-lg font-bold">GENESIS 2.0</span>
          </div>
          <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-400">
            <Coins className="h-3 w-3 mr-1" />
            {credits.toLocaleString()} Credits
          </Badge>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${status === 'GENERATING' ? 'bg-green-500 animate-pulse' : status === 'PLANNING' ? 'bg-yellow-500 animate-pulse' : status === 'COMPLETE' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
            <span className="text-sm text-gray-400">• {status}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={() => { setShowSettings(!showSettings); setShowProfile(false); }}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={() => { setShowProfile(!showProfile); setShowSettings(false); }}
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            Export Project
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-gray-800 bg-[#0f0f0f] px-6 py-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Settings</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                  <CloseIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Account Credits</label>
                <div className="text-2xl font-bold text-white">{credits.toLocaleString()}</div>
                <Button size="sm" className="mt-2 bg-purple-600 hover:bg-purple-700">
                  Buy More
                </Button>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">API Configuration</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700"
                  onClick={() => alert('Manage API keys - Coming soon!')}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Manage Keys
                </Button>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Preferences</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700"
                  onClick={() => { setShowProfile(true); setShowSettings(false); }}
                >
                  <FileEdit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile Panel */}
      {showProfile && (
        <div className="border-b border-gray-800 bg-[#0f0f0f] px-6 py-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Profile</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowProfile(false)}>
                  <CloseIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Name</label>
                  <Input
                    className="bg-gray-800 border-gray-700 text-white"
                    value={userProfile?.name || 'Loading...'}
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Email</label>
                  <Input
                    className="bg-gray-800 border-gray-700 text-white"
                    value={userProfile?.email || 'Loading...'}
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Credits</label>
                  <div className="text-xl font-bold text-white">{credits.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Plan Display */}
      {showPlan && currentPlan && (
        <div className="border-b border-gray-800 bg-[#0f0f0f] px-6 py-4">
          <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Development Plan</CardTitle>
                  <CardDescription className="text-gray-400">Estimated time: {currentPlan.estimatedTime}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setShowPlan(false); setCurrentPlan(null); }}>
                  <CloseIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">Steps:</h4>
                  <ul className="space-y-2">
                    {currentPlan.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">Components:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentPlan.components.map((component, idx) => (
                      <Badge key={idx} variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-400">
                        {component}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 space-x-2">
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setShowPlan(false)
                        handleSend()
                      }}
                    >
                      Approve & Start Building
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-700"
                      onClick={() => setShowPlan(false)}
                    >
                      Make Changes
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content - Three Panels */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Projects & Explorer */}
        <div className="w-64 border-r border-gray-800 bg-[#0f0f0f] flex flex-col">
          {/* Project Switcher */}
          <div className="p-4 border-b border-gray-800">
            <ProjectSwitcher
              onProjectSelect={setCurrentProjectId}
              currentProjectId={currentProjectId}
            />
          </div>

          {/* Explorer */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-300">Explorer</h2>
              <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/20 text-purple-400">
                VFS
              </Badge>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {projectFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Folder className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-sm">No Project Loaded</p>
              </div>
            ) : (
              <div className="space-y-1">
                {projectFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between group p-2 rounded cursor-pointer hover:bg-gray-800 ${selectedFile === file.name ? 'bg-gray-800 border-l-2 border-purple-500' : ''
                      }`}
                  >
                    <div
                      onClick={() => setSelectedFile(file.name)}
                      className="flex items-center space-x-2 flex-1 min-w-0"
                    >
                      <FileCode className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300 truncate">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteFile(file.name)}
                    >
                      <Trash2 className="h-3 w-3 text-red-400" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Upload Section */}
          <div className="border-t border-gray-800 p-4 space-y-2">
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="h-3 w-3 mr-2" />
                Upload Docs
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 w-full"
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon className="h-3 w-3 mr-2" />
                Upload Images
              </Button>
            </div>
            {(uploadedDocuments.length > 0 || uploadedImages.length > 0) && (
              <div className="mt-2 space-y-1">
                {uploadedDocuments.map((file, idx) => (
                  <div key={idx} className="text-xs text-gray-500 flex items-center space-x-1">
                    <FileText className="h-3 w-3" />
                    <span className="truncate flex-1">{file.name}</span>
                    <X className="h-3 w-3 cursor-pointer hover:text-red-400 flex-shrink-0" onClick={() => setUploadedDocuments(prev => prev.filter((_, i) => i !== idx))} />
                  </div>
                ))}
                {uploadedImages.map((file, idx) => (
                  <div key={idx} className="text-xs text-gray-500 flex items-center space-x-1">
                    <ImageIcon className="h-3 w-3" />
                    <span className="truncate flex-1">{file.name}</span>
                    <X className="h-3 w-3 cursor-pointer hover:text-red-400 flex-shrink-0" onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle Panel - Command Center (AI-1) */}
        <div className="flex-1 border-r border-gray-800 bg-[#0a0a0a] flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-semibold text-gray-300">Command Center</h2>
                <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/20 text-purple-400">
                  AI-1
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user'
                    ? 'bg-purple-500/20 border border-purple-500/30'
                    : 'bg-gray-800 border border-gray-700'
                    }`}
                >
                  <p className="text-sm text-gray-200 whitespace-pre-wrap">{message.content}</p>
                  {message.timestamp && (
                    <p className="text-xs text-gray-500 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {streamingText && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 max-w-[80%]">
                  <p className="text-sm text-gray-200 whitespace-pre-wrap">{streamingText}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <Loader2 className="h-3 w-3 animate-spin text-purple-500" />
                    <span className="text-xs text-gray-500">Generating...</span>
                  </div>
                </div>
              </div>
            )}
            {isGenerating && !streamingText && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                    <span className="text-sm text-gray-400">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-end space-x-2">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your dApp..."
                className="bg-[#0f0f0f] border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 resize-none min-h-[60px] max-h-[120px]"
                disabled={isGenerating}
                rows={2}
              />
              <Button
                onClick={handleSend}
                disabled={!prompt.trim() || isGenerating}
                className="bg-purple-600 hover:bg-purple-700 text-white h-[60px]"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>0 Issues</span>
                </span>
                {(uploadedDocuments.length > 0 || uploadedImages.length > 0) && (
                  <span className="flex items-center space-x-1">
                    <Upload className="h-3 w-3" />
                    <span>{uploadedDocuments.length + uploadedImages.length} files attached</span>
                  </span>
                )}
              </div>
              <span>{credits} credits remaining</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-1/2 border-l border-gray-800 bg-[#0a0a0a] flex flex-col">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-300">Live Preview</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant={previewMode === 'preview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('preview')}
                className={previewMode === 'preview' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-700 text-gray-400'}
              >
                <Play className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                variant={previewMode === 'code' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('code')}
                className={previewMode === 'code' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-700 text-gray-400'}
              >
                <Code className="h-4 w-4 mr-2" />
                Code
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6">
            {previewMode === 'code' ? (
              selectedFileContent ? (
                <pre className="bg-[#0f0f0f] p-4 rounded-lg border border-gray-800 overflow-x-auto">
                  <code className="text-sm text-gray-300 font-mono">{selectedFileContent}</code>
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Code className="h-16 w-16 mb-4 opacity-50" />
                  <p className="text-sm">No file selected</p>
                  <p className="text-xs mt-2">Select a file from the Explorer to view code</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="h-24 w-24 rounded-full bg-gray-800 flex items-center justify-center mb-4 opacity-50">
                  <Settings className="h-12 w-12" />
                </div>
                <p className="text-sm mb-2">Waiting for generation...</p>
                <p className="text-xs text-gray-600">Describe your dApp to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
