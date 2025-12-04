"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Zap, 
  Globe, 
  Code, 
  BarChart,
  Upload,
  Search,
  FileText,
  Coins,
  User,
  Settings,
  Radio,
  Image as ImageIcon,
  PlayCircle,
  Sun,
  Moon
} from "lucide-react"
import { useEffect, useState } from "react"

export default function LandingPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Genesis</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
            <Link href="/auth/signin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href="/auth/signup">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">AI-Powered Smart Contract Generation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Generate Smart Contracts
            <br />
            With AI Precision
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Multi-agent AI system for dApp generation with real-time streaming, 
            security analysis, document processing, and auto-deployment to Sepolia testnet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href="/auth/signup">
                Start Building <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/docs">
                View Documentation
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">10K+</div>
              <div className="text-sm text-muted-foreground">Contracts Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">24/7</div>
              <div className="text-sm text-muted-foreground">AI Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Sepolia</div>
              <div className="text-sm text-muted-foreground">Testnet Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Modern Development
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build, test, and deploy smart contracts with confidence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Real-time Streaming */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl bg-white dark:bg-slate-900 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Radio className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Real-Time Streaming</CardTitle>
                <CardDescription>
                  Watch your contracts generate in real-time with live streaming responses. See every line of code as it's created.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  Live Updates
                </Badge>
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl bg-white dark:bg-slate-900 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Document Upload</CardTitle>
                <CardDescription>
                  Upload PDF/TXT files to provide context for contract generation. The AI learns from your specifications and requirements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">PDF</Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">TXT</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl bg-white dark:bg-slate-900 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Image Upload</CardTitle>
                <CardDescription>
                  Upload images of diagrams, flowcharts, or specifications. AI vision processes visual requirements for contract generation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  Vision AI
                </Badge>
              </CardContent>
            </Card>

            {/* Credit-Based System */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl bg-white dark:bg-slate-900 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Coins className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Credit-Based System</CardTitle>
                <CardDescription>
                  Flexible pricing with credits. Pay only for what you use. Track your usage and manage credits from your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                  Pay Per Use
                </Badge>
              </CardContent>
            </Card>

            {/* Security Analysis */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl bg-white dark:bg-slate-900 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Security Analysis</CardTitle>
                <CardDescription>
                  Built-in security analysis identifies vulnerabilities and suggests improvements before deployment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                  Auto-Scan
                </Badge>
              </CardContent>
            </Card>

            {/* Auto-Deployment */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl bg-white dark:bg-slate-900 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Auto-Deployment</CardTitle>
                <CardDescription>
                  One-click deployment to Sepolia testnet. No manual configuration required. Verified and ready to use.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                  Sepolia
                </Badge>
              </CardContent>
            </Card>

            {/* Web Search Integration */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl bg-white dark:bg-slate-900 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Web Search Integration</CardTitle>
                <CardDescription>
                  Access real-time web data and documentation to enhance contract generation with the latest information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
                  Tavily AI
                </Badge>
              </CardContent>
            </Card>

            {/* Account & Profile Settings */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl bg-white dark:bg-slate-900 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>
                  Complete profile settings, account management, and preferences. Manage your API keys, wallet connections, and more.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">Profile</Badge>
                  <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">Settings</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Multi-Agent System */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl bg-white dark:bg-slate-900 shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Multi-Agent AI System</CardTitle>
                <CardDescription>
                  Specialized AI agents work together: Architect plans, Engineer codes, Security Analyst audits, Optimizer refines.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  4 AI Agents
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-background/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From idea to deployed contract in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Describe", desc: "Tell AI what you want to build", icon: FileText },
              { step: "2", title: "Upload", desc: "Add documents or images for context", icon: Upload },
              { step: "3", title: "Generate", desc: "Watch AI create your contract live", icon: PlayCircle },
              { step: "4", title: "Deploy", desc: "One-click deployment to testnet", icon: Globe }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build the Future?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of developers using Genesis to create innovative smart contracts
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
            <Link href="/auth/signup">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-4 bg-background/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Genesis</span>
              </div>
              <p className="text-muted-foreground text-sm">
                AI-powered smart contract generation for the modern web3 developer.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
                <li><Link href="/docs" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="/auth/signup" className="hover:text-foreground">Get Started</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Real-time Streaming</li>
                <li>Document & Image Upload</li>
                <li>Credit System</li>
                <li>Account Settings</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
                <li><Link href="/security" className="hover:text-foreground">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Genesis. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
