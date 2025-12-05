"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import {
  Sparkles,
  Code,
  Shield,
  Zap,
  Book,
  Github,
  Play,
  Settings,
  Network,
  Cpu,
  Cloud,
  Sun,
  Moon,
  Menu,
  X
} from "lucide-react"

export default function DocsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sections = [
    {
      title: "Getting Started",
      items: [
        { title: "Introduction", id: "intro", icon: Book },
        { title: "Quick Start", id: "quickstart", icon: Zap },
        { title: "Installation", id: "installation", icon: Settings },
      ]
    },
    {
      title: "Core Features",
      items: [
        { title: "Project Sessions", id: "projects", icon: Settings },
        { title: "File Uploads", id: "uploads", icon: Cloud },
        { title: "Environment Variables", id: "env", icon: Shield },
        { title: "Full-Stack Generation", id: "fullstack", icon: Code },
      ]
    },
    {
      title: "Architecture",
      items: [
        { title: "MCP Servers", id: "mcp", icon: Network },
        { title: "AI Agents", id: "agents", icon: Cpu },
        { title: "NullShot Framework", id: "nullshot", icon: Cloud },
      ]
    },
    {
      title: "Reference",
      items: [
        { title: "API Reference", id: "api", icon: Network },
        { title: "Contract Generation", id: "generation", icon: Code },
        { title: "Security Analysis", id: "security", icon: Shield },
        { title: "Deployment", id: "deployment", icon: Play },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Genesis</span>
              <Badge variant="secondary" className="ml-2">Docs</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden md:block">
              Home
            </Link>
            <Link href="/docs" className="text-sm text-foreground font-medium">
              Documentation
            </Link>
            <Link href="/auth/signin" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden md:block">
              Sign In
            </Link>
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-9 w-9"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hidden md:flex">
              <Link href="/auth/signup">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 border-r border-border bg-card/50 overflow-hidden md:w-64 md:block`}>
          <div className="h-[calc(100vh-4rem)] overflow-y-auto p-6 space-y-8">
            {sections.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                  {section.title}
                </h3>
                <nav className="space-y-1">
                  {section.items.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors group"
                    >
                      <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                      <span>{item.title}</span>
                    </a>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Hero */}
            <div className="mb-12">
              <Badge className="mb-4">Documentation</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Genesis 2.0 Documentation
              </h1>
              <p className="text-xl text-muted-foreground">
                Complete guide to AI-powered smart contract generation, MCP servers, multi-agent systems, and the NullShot framework
              </p>
            </div>

            {/* Introduction */}
            <section id="intro" className="mb-16 scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Book className="h-5 w-5" />
                    <span>Introduction</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Genesis 2.0 is an AI-powered smart contract generation platform that leverages multi-agent AI systems,
                    Model Context Protocol (MCP) servers, and the NullShot framework to create production-ready dApps.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Multi-Agent AI</h4>
                      <p className="text-sm text-muted-foreground">Specialized agents working together</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">MCP Integration</h4>
                      <p className="text-sm text-muted-foreground">Standardized tool protocol</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Edge Deployment</h4>
                      <p className="text-sm text-muted-foreground">Powered by Cloudflare Workers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Quick Start */}
            <section id="quickstart" className="mb-16 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-6 flex items-center space-x-2">
                <Zap className="h-6 w-6" />
                <span>Quick Start</span>
              </h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-3">
                    {[
                      { step: 1, title: "Sign Up", desc: "Create your Genesis account" },
                      { step: 2, title: "Describe Your dApp", desc: "Tell the AI what you want to build" },
                      { step: 3, title: "Review Plan", desc: "Approve the generated development plan" },
                      { step: 4, title: "Generate & Deploy", desc: "Watch as your contract is built and deployed" }
                    ].map((item) => (
                      <div key={item.step} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* MCP Servers */}
            <section id="mcp" className="mb-16 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-6 flex items-center space-x-2">
                <Network className="h-6 w-6" />
                <span>Model Context Protocol (MCP) Servers</span>
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What is MCP?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      The Model Context Protocol (MCP) is an open protocol that enables AI applications to securely access
                      external data sources and tools. In Genesis, MCP servers act as the bridge between our AI agents and blockchain operations.
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-mono whitespace-pre-wrap">
                        {`MCP servers expose tools that agents can call:
• deploy_contract: Deploy contracts to Sepolia testnet
• verify_source: Verify contract source code
• analyze_security: Perform security analysis`}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Genesis MCP Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold mb-1">deploy_contract</h4>
                        <p className="text-sm text-muted-foreground">
                          Deploys Solidity contracts to Sepolia testnet with automatic transaction handling.
                        </p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-semibold mb-1">verify_source</h4>
                        <p className="text-sm text-muted-foreground">
                          Verifies contract source code on Etherscan-compatible block explorers for transparency.
                        </p>
                      </div>
                      <div className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-semibold mb-1">analyze_security</h4>
                        <p className="text-sm text-muted-foreground">
                          Performs comprehensive AI-powered security analysis to detect vulnerabilities.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* AI Agents */}
            <section id="agents" className="mb-16 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-6 flex items-center space-x-2">
                <Cpu className="h-6 w-6" />
                <span>Multi-Agent AI System</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-blue-500" />
                      <span>Architect Agent</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Analyzes requirements and creates detailed implementation plans with step-by-step breakdowns.
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Requirement analysis</li>
                      <li>• Architecture planning</li>
                      <li>• Component identification</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="h-5 w-5 text-purple-500" />
                      <span>Engineer Agent</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generates production-ready Solidity code following best practices and standards.
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Code generation</li>
                      <li>• Best practices</li>
                      <li>• OpenZeppelin integration</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-red-500" />
                      <span>Security Analyst</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Reviews contracts for vulnerabilities and security issues before deployment.
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Vulnerability detection</li>
                      <li>• Security scoring</li>
                      <li>• Recommendations</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-green-500" />
                      <span>Optimizer Agent</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Optimizes gas usage and improves code efficiency.
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Gas optimization</li>
                      <li>• Storage layout</li>
                      <li>• Performance tuning</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Project Sessions */}
            <section id="projects" className="mb-16 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-6 flex items-center space-x-2">
                <Settings className="h-6 w-6" />
                <span>Project Sessions</span>
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle>Multi-Project Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Genesis supports multiple project sessions, similar to Cursor or Bolt. Each project maintains its own:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">💬 Chat History</h4>
                      <p className="text-sm text-muted-foreground">
                        All conversations are saved per project. Switch between projects without losing context.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">📁 Generated Files</h4>
                      <p className="text-sm text-muted-foreground">
                        Contracts, frontend code, and configs are organized by project.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">📤 Uploaded Files</h4>
                      <p className="text-sm text-muted-foreground">
                        PDFs and images uploaded for context stay with their project.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">⚙️ Project Settings</h4>
                      <p className="text-sm text-muted-foreground">
                        Each project can have its own configuration and metadata.
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg mt-4">
                    <h4 className="font-semibold mb-2">How to Use:</h4>
                    <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                      <li>Click "New Project" in the dashboard</li>
                      <li>Give your project a name and description</li>
                      <li>Start chatting with the AI about your dApp</li>
                      <li>Switch between projects anytime from the sidebar</li>
                      <li>All your work is automatically saved</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* File Uploads */}
            <section id="uploads" className="mb-16 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-6 flex items-center space-x-2">
                <Cloud className="h-6 w-6" />
                <span>File Uploads & Context</span>
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Document Upload (PDF/TXT)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Upload documentation, whitepapers, or specifications to give the AI more context about your project.
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Supported Formats:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• PDF - Technical documentation, whitepapers</li>
                        <li>• TXT - Plain text specifications, requirements</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        <strong>Pro Tip:</strong> Upload your project requirements or existing contract documentation
                        to help the AI understand your specific needs better.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Image Upload</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Upload UI mockups, wireframes, or design references for frontend generation.
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Use Cases:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• UI/UX mockups for frontend generation</li>
                        <li>• Architecture diagrams for system design</li>
                        <li>• Design references for styling</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* ENV Management */}
            <section id="env" className="mb-16 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-6 flex items-center space-x-2">
                <Shield className="h-6 w-6" />
                <span>Environment Variables</span>
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle>Secure API Key Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Store your API keys securely and use them for dApp generation. All values are encrypted at rest.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">🔐 Encrypted Storage</h4>
                      <p className="text-sm text-muted-foreground">
                        All API keys are encrypted using AES-256 before storage.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">🔑 Your Keys, Your Control</h4>
                      <p className="text-sm text-muted-foreground">
                        Use your own AI provider keys for generation.
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Supported Keys:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• GEMINI_API_KEY - Google AI for generation</li>
                      <li>• TAVILY_API_KEY - Web search integration</li>
                      <li>• DEPLOYER_PRIVATE_KEY - Ethereum deployment</li>
                      <li>• Custom keys for your specific needs</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                    <p className="text-sm text-yellow-900 dark:text-yellow-100">
                      <strong>Security Note:</strong> Never share your API keys. Genesis encrypts them,
                      but you should still rotate keys regularly and use keys with appropriate permissions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Full-Stack Generation */}
            <section id="fullstack" className="mb-16 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-6 flex items-center space-x-2">
                <Code className="h-6 w-6" />
                <span>Full-Stack dApp Generation</span>
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle>Complete Project Generation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Genesis doesn't just generate smart contracts - it builds complete, production-ready dApps with frontend, backend, and deployment scripts.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">📜 Smart Contracts</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Solidity contracts</li>
                        <li>• Test files</li>
                        <li>• Deployment scripts</li>
                        <li>• Security analysis</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">🎨 Frontend</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• React/Next.js</li>
                        <li>• TypeScript</li>
                        <li>• Tailwind CSS</li>
                        <li>• Web3 integration</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">⚙️ Backend</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• API routes</li>
                        <li>• Database schemas</li>
                        <li>• Authentication</li>
                        <li>• Integration code</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Generation Workflow:</h4>
                    <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                      <li><strong>Planning:</strong> AI analyzes your requirements and creates a detailed plan</li>
                      <li><strong>Architecture:</strong> Designs the system structure and component relationships</li>
                      <li><strong>Code Generation:</strong> Generates all files (contracts, frontend, backend)</li>
                      <li><strong>Security Analysis:</strong> Scans for vulnerabilities and suggests improvements</li>
                      <li><strong>Integration:</strong> Creates connection code between components</li>
                      <li><strong>Documentation:</strong> Generates README and setup instructions</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* API Reference */}
            <section id="api" className="mb-16 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-6 flex items-center space-x-2">
                <Network className="h-6 w-6" />
                <span>API Reference</span>
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Projects API</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold mb-1">POST /api/projects</h4>
                        <p className="text-sm text-muted-foreground mb-2">Create a new project</p>
                        <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                          {`{
  "name": "My NFT Marketplace",
  "description": "A marketplace for trading NFTs"
}`}
                        </pre>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold mb-1">GET /api/projects</h4>
                        <p className="text-sm text-muted-foreground">List all user projects</p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-semibold mb-1">GET /api/projects/:id</h4>
                        <p className="text-sm text-muted-foreground">Get project details</p>
                      </div>
                      <div className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-semibold mb-1">DELETE /api/projects/:id</h4>
                        <p className="text-sm text-muted-foreground">Delete a project</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Messages API</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold mb-1">POST /api/projects/:id/messages</h4>
                        <p className="text-sm text-muted-foreground mb-2">Add a message to project chat</p>
                        <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                          {`{
  "role": "user",
  "content": "Add a minting function to the contract"
}`}
                        </pre>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold mb-1">GET /api/projects/:id/messages</h4>
                        <p className="text-sm text-muted-foreground">Get project chat history</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Files API</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold mb-1">POST /api/projects/:id/files</h4>
                        <p className="text-sm text-muted-foreground mb-2">Add a generated file to project</p>
                        <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                          {`{
  "name": "Token.sol",
  "path": "contracts/Token.sol",
  "content": "pragma solidity...",
  "type": "contract",
  "language": "solidity"
}`}
                        </pre>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold mb-1">GET /api/projects/:id/files</h4>
                        <p className="text-sm text-muted-foreground">Get all project files</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* NullShot Framework */}
            <section id="nullshot" className="mb-16 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-6 flex items-center space-x-2">
                <Cloud className="h-6 w-6" />
                <span>NullShot Framework</span>
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle>What is NullShot?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    NullShot is a TypeScript agent framework designed for Cloudflare Workers. It provides a standardized
                    way to build, deploy, and manage AI agents at the edge.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Edge deployment on Cloudflare Workers</li>
                      <li>• Multi-AI provider support (OpenAI, Anthropic, Gemini, etc.)</li>
                      <li>• Durable Objects for state management</li>
                      <li>• Streaming responses for real-time interaction</li>
                      <li>• Built-in MCP server integration</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Footer */}
            <div className="border-t border-border mt-16 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div>
                  <p className="text-sm text-muted-foreground">
                    &copy; 2024 Genesis. All rights reserved.
                  </p>
                </div>
                <div className="flex items-center space-x-6">
                  <Link href="https://github.com" className="text-sm text-muted-foreground hover:text-foreground">
                    <Github className="h-5 w-5" />
                  </Link>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/auth/signup">
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
