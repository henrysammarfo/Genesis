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
      title: "Architecture",
      items: [
        { title: "MCP Servers", id: "mcp", icon: Network },
        { title: "AI Agents", id: "agents", icon: Cpu },
        { title: "NullShot Framework", id: "nullshot", icon: Cloud },
      ]
    },
    {
      title: "Features",
      items: [
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
