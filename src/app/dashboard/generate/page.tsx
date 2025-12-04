"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Code, 
  Upload, 
  Search, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Copy,
  Download,
  Play,
  Settings,
  Shield
} from "lucide-react"

export default function ContractGenerator() {
  const [prompt, setPrompt] = useState("")
  const [contractName, setContractName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [securityAnalysis, setSecurityAnalysis] = useState<any>(null)
  const [activeStep, setActiveStep] = useState(1)

  const contractTemplates = [
    {
      name: "ERC20 Token",
      description: "Standard fungible token with transfer, approve, and mint functionality",
      prompt: "Create an ERC20 token contract with a total supply of 1 million tokens, with minting and burning capabilities, and pausable functionality."
    },
    {
      name: "NFT Collection",
      description: "Non-fungible token contract with metadata and minting controls",
      prompt: "Create an ERC721 NFT collection contract with metadata URI support, maximum supply of 1000 tokens, and owner-only minting function."
    },
    {
      name: "Multi-Sig Wallet",
      description: "Secure multi-signature wallet for team fund management",
      prompt: "Create a multi-signature wallet contract requiring 2 out of 3 owners to approve transactions, with daily withdrawal limits and emergency pause functionality."
    },
    {
      name: "DeFi Staking",
      description: "Staking contract with rewards and lock periods",
      prompt: "Create a DeFi staking contract where users can stake tokens and earn rewards, with minimum lock periods of 30 days and variable reward rates based on lock duration."
    }
  ]

  const handleGenerate = async () => {
    if (!prompt.trim() || !contractName.trim()) return
    setIsGenerating(true)
    setActiveStep(1)
    
    // Simulate generation steps
    setTimeout(() => {
      setActiveStep(2)
      setTimeout(() => {
        setActiveStep(3)
        setTimeout(() => {
          setGeneratedCode(`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${contractName} is ERC20, Ownable {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}`)
          setSecurityAnalysis({
            score: 95,
            issues: [
              { severity: "info", message: "Consider adding pausable functionality" },
              { severity: "warning", message: "No access control for burn function" }
            ]
          })
          setIsGenerating(false)
          setActiveStep(4)
        }, 2000)
      }, 2000)
    }, 1500)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode)
  }

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${contractName}.sol`
    a.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Genesis</span>
            </div>
            
            <nav className="space-y-2">
              <a href="/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent">
                <Settings className="h-5 w-5" />
                <span>Dashboard</span>
              </a>
              <a href="/dashboard/generate" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary text-primary-foreground">
                <Code className="h-5 w-5" />
                <span>Generate</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Smart Contract Generator</h1>
              <p className="text-muted-foreground">
                Create production-ready smart contracts with AI assistance
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Panel - Input */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Contract Name</label>
                      <Input
                        placeholder="MyToken"
                        value={contractName}
                        onChange={(e) => setContractName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        placeholder="Describe your contract requirements..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[150px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Templates</CardTitle>
                    <CardDescription>Start with a proven template</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {contractTemplates.map((template, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => {
                          setContractName(template.name.replace(/\s+/g, ''))
                          setPrompt(template.prompt)
                        }}
                      >
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Enhancements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Upload documents</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Web search enabled</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Output */}
              <div className="lg:col-span-2 space-y-6">
                {isGenerating && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                        <span>Generating Contract</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className={`flex items-center space-x-3 ${activeStep >= 1 ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {activeStep >= 1 ? <CheckCircle className="h-5 w-5" /> : <div className="h-5 w-5 border-2 border-muted-foreground rounded-full" />}
                          <span>Analyzing requirements</span>
                        </div>
                        <div className={`flex items-center space-x-3 ${activeStep >= 2 ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {activeStep >= 2 ? <CheckCircle className="h-5 w-5" /> : <div className="h-5 w-5 border-2 border-muted-foreground rounded-full" />}
                          <span>Generating contract code</span>
                        </div>
                        <div className={`flex items-center space-x-3 ${activeStep >= 3 ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {activeStep >= 3 ? <CheckCircle className="h-5 w-5" /> : <div className="h-5 w-5 border-2 border-muted-foreground rounded-full" />}
                          <span>Running security analysis</span>
                        </div>
                        <div className={`flex items-center space-x-3 ${activeStep >= 4 ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {activeStep >= 4 ? <CheckCircle className="h-5 w-5" /> : <div className="h-5 w-5 border-2 border-muted-foreground rounded-full" />}
                          <span>Optimizing gas usage</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {generatedCode && (
                  <>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center space-x-2">
                            <Code className="h-5 w-5" />
                            <span>Generated Code</span>
                          </CardTitle>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={copyToClipboard}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={downloadCode}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                          <pre className="text-sm font-mono">
                            <code>{generatedCode}</code>
                          </pre>
                        </div>
                      </CardContent>
                    </Card>

                    {securityAnalysis && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Shield className="h-5 w-5" />
                            <span>Security Analysis</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Security Score</span>
                              <Badge variant={securityAnalysis.score >= 90 ? "default" : "secondary"}>
                                {securityAnalysis.score}/100
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              {securityAnalysis.issues.map((issue: any, index: number) => (
                                <div key={index} className="flex items-start space-x-2 p-2 rounded border">
                                  {issue.severity === "info" ? (
                                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                                  ) : (
                                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                                  )}
                                  <span className="text-sm">{issue.message}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex space-x-4">
                      <Button className="flex-1">
                        <Play className="h-4 w-4 mr-2" />
                        Test Contract
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Deploy to Testnet
                      </Button>
                    </div>
                  </>
                )}

                {!isGenerating && !generatedCode && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Ready to Generate</h3>
                      <p className="text-muted-foreground mb-6">
                        Fill in the contract details and click generate to create your smart contract
                      </p>
                      <Button 
                        onClick={handleGenerate} 
                        disabled={!prompt.trim() || !contractName.trim()}
                        className="min-w-[150px]"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Contract
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
