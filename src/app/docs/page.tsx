import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Rocket, Zap, Shield, Book, Terminal, FileCode, Cpu } from "lucide-react"

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold">Genesis</Link>
                    <nav className="flex items-center gap-6">
                        <Link href="/#features" className="text-white/70 hover:text-white transition-colors">Features</Link>
                        <Link href="/#pricing" className="text-white/70 hover:text-white transition-colors">Pricing</Link>
                        <Link href="/docs" className="text-white font-medium">Docs</Link>
                        <Link href="/dashboard">
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Dashboard</Button>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section className="container mx-auto px-6 py-20 text-center">
                <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">Documentation</Badge>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Genesis Documentation
                </h1>
                <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
                    Everything you need to build production-ready smart contracts with AI-powered multi-agent orchestration
                </p>
            </section>

            {/* Quick Start */}
            <section className="container mx-auto px-6 py-16">
                <Card className="bg-white/5 border-white/10 mb-12">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl text-white">
                            <Rocket className="h-6 w-6 text-purple-400" />
                            Quick Start
                        </CardTitle>
                        <CardDescription className="text-white/60">Get started with Genesis in 3 simple steps</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                                <div className="text-3xl font-bold text-purple-400 mb-2">1</div>
                                <h3 className="text-lg font-semibold mb-2 text-white">Sign Up</h3>
                                <p className="text-white/60 text-sm">Create your free account with Google or GitHub OAuth. Get 100 free credits to start building.</p>
                            </div>
                            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                                <div className="text-3xl font-bold text-purple-400 mb-2">2</div>
                                <h3 className="text-lg font-semibold mb-2 text-white">Describe Your dApp</h3>
                                <p className="text-white/60 text-sm">Use natural language to describe your smart contract. Our AI agents will handle the rest.</p>
                            </div>
                            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                                <div className="text-3xl font-bold text-purple-400 mb-2">3</div>
                                <h3 className="text-lg font-semibold mb-2 text-white">Deploy & Export</h3>
                                <p className="text-white/60 text-sm">Deploy to Sepolia testnet instantly and export your complete project as a ZIP file.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Core Concepts */}
                <h2 className="text-3xl font-bold mb-8 text-white">Core Concepts</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Cpu className="h-5 w-5 text-blue-400" />
                                Multi-Agent System
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-white/70 space-y-2">
                            <p><strong className="text-white">Architect Agent:</strong> Analyzes requirements and plans contract structure</p>
                            <p><strong className="text-white">Engineer Agent:</strong> Writes Solidity code with security best practices</p>
                            <p><strong className="text-white">Designer Agent:</strong> Generates React UI components</p>
                            <p><strong className="text-white">Deployer Agent:</strong> Compiles and deploys to blockchain</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Shield className="h-5 w-5 text-green-400" />
                                MCP Server
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-white/70 space-y-2">
                            <p>Genesis exposes deployment tools via Model Context Protocol (MCP) for cross-agent collaboration.</p>
                            <p className="mt-4"><strong className="text-white">Available Tools:</strong></p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>deploy_contract</li>
                                <li>verify_source</li>
                                <li>analyze_security</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Zap className="h-5 w-5 text-yellow-400" />
                                Credit System
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-white/70 space-y-2">
                            <p>Every generation consumes credits based on AI token usage and blockchain gas fees.</p>
                            <p className="mt-4"><strong className="text-white">Credit Costs:</strong></p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Simple contracts: ~5-10 credits</li>
                                <li>Complex contracts: ~15-30 credits</li>
                                <li>With deployment: +gas fees</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <FileCode className="h-5 w-5 text-purple-400" />
                                Project Export
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-white/70 space-y-2">
                            <p>Download your complete project including:</p>
                            <ul className="list-disc list-inside space-y-1 mt-2">
                                <li>Solidity smart contract</li>
                                <li>React UI components</li>
                                <li>Styles and configuration</li>
                                <li>README with setup instructions</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* API Reference */}
                <h2 className="text-3xl font-bold mb-8 text-white">API Reference</h2>
                <Card className="bg-white/5 border-white/10 mb-12">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Terminal className="h-5 w-5 text-green-400" />
                            Build API
                        </CardTitle>
                        <CardDescription className="text-white/60">POST /api/build</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2 text-white">Request Body</h4>
                            <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm border border-white/10">
                                <code className="text-green-400">{`{
  "prompt": "Create an ERC20 token with 1M supply",
  "stream": true,
  "files": [],
  "useSearch": false
}`}</code>
                            </pre>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2 text-white">Response (SSE Stream)</h4>
                            <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm border border-white/10">
                                <code className="text-blue-400">{`data: {"type":"status","agent":"architect","message":"Planning..."}
data: {"type":"status","agent":"engineer","message":"Writing code..."}
data: {"type":"complete","contractCode":"...","files":{...}}`}</code>
                            </pre>
                        </div>
                    </CardContent>
                </Card>

                {/* Environment Setup */}
                <h2 className="text-3xl font-bold mb-8 text-white">Environment Setup</h2>
                <Card className="bg-white/5 border-white/10 mb-12">
                    <CardHeader>
                        <CardTitle className="text-white">Required Environment Variables</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-white/70">
                            <div>
                                <code className="text-purple-400">DEPLOYER_PRIVATE_KEY</code>
                                <p className="mt-1">Your Ethereum wallet private key for deploying contracts (stored encrypted in Settings)</p>
                            </div>
                            <div>
                                <code className="text-purple-400">RPC_URL</code>
                                <p className="mt-1">Custom RPC endpoint (optional, defaults to Sepolia)</p>
                            </div>
                            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                <p className="text-yellow-200">
                                    <strong>⚠️ Security:</strong> All private keys are encrypted using AES-256 before storage. Configure them in Dashboard → Settings.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Examples */}
                <h2 className="text-3xl font-bold mb-8 text-white">Examples</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">ERC20 Token</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm border border-white/10">
                                <code className="text-white/80">{`"Create an ERC20 token called MyToken 
with symbol MTK and total supply of 
1,000,000 tokens"`}</code>
                            </pre>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">NFT Collection</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm border border-white/10">
                                <code className="text-white/80">{`"Build an ERC721 NFT collection with 
minting function, max supply of 10,000, 
and 0.01 ETH mint price"`}</code>
                            </pre>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">DAO Governance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm border border-white/10">
                                <code className="text-white/80">{`"Create a DAO with proposal creation, 
voting mechanism, and timelock for 
executing approved proposals"`}</code>
                            </pre>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Staking Contract</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm border border-white/10">
                                <code className="text-white/80">{`"Build a staking contract where users 
can stake tokens and earn 10% APY rewards 
with 30-day lock period"`}</code>
                            </pre>
                        </CardContent>
                    </Card>
                </div>

                {/* Support */}
                <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30">
                    <CardHeader>
                        <CardTitle className="text-white">Need Help?</CardTitle>
                    </CardHeader>
                    <CardContent className="text-white/80">
                        <p className="mb-4">Join our community or reach out for support:</p>
                        <div className="flex gap-4">
                            <Link href="/dashboard">
                                <Button className="bg-purple-600 hover:bg-purple-700">
                                    <Rocket className="h-4 w-4 mr-2" />
                                    Start Building
                                </Button>
                            </Link>
                            <Link href="/#faq">
                                <Button variant="outline" className="border-white/20 hover:bg-white/10">
                                    <Book className="h-4 w-4 mr-2" />
                                    View FAQ
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}
