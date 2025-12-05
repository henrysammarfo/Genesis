'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const MCP_WORKER_URL = process.env.NEXT_PUBLIC_MCP_WORKER_URL || 'https://genesis-ai.genesis-ai.workers.dev';

export default function MCPTestPage() {
    const [testing, setTesting] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [contractCode, setContractCode] = useState(`pragma solidity ^0.8.0;

contract SimpleToken {
    mapping(address => uint256) public balances;
    
    function transfer(address to, uint256 amount) public {
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}`);

    const runTests = async () => {
        setTesting(true);
        setResults([]);
        const testResults: any[] = [];

        // Test 1: Health Check
        try {
            const response = await fetch(`${MCP_WORKER_URL}/health`);
            const data = await response.json();
            testResults.push({
                name: 'Health Check',
                passed: response.ok && data.status === 'healthy',
                details: JSON.stringify(data, null, 2)
            });
        } catch (error: any) {
            testResults.push({
                name: 'Health Check',
                passed: false,
                details: error.message
            });
        }

        // Test 2: Tools List
        try {
            const response = await fetch(`${MCP_WORKER_URL}/mcp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
            });
            const data = await response.json();
            testResults.push({
                name: 'Tools List',
                passed: response.ok && data.tools && data.tools.length > 0,
                details: JSON.stringify(data, null, 2)
            });
        } catch (error: any) {
            testResults.push({
                name: 'Tools List',
                passed: false,
                details: error.message
            });
        }

        // Test 3: Security Analysis
        try {
            const response = await fetch(`${MCP_WORKER_URL}/mcp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 2,
                    method: 'tools/call',
                    params: {
                        name: 'analyze_security',
                        arguments: { source_code: contractCode }
                    }
                })
            });
            const data = await response.json();
            testResults.push({
                name: 'Security Analysis',
                passed: response.ok && data.success,
                details: JSON.stringify(data, null, 2)
            });
        } catch (error: any) {
            testResults.push({
                name: 'Security Analysis',
                passed: false,
                details: error.message
            });
        }

        // Test 4: Verify Source
        try {
            const response = await fetch(`${MCP_WORKER_URL}/mcp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 3,
                    method: 'tools/call',
                    params: {
                        name: 'verify_source',
                        arguments: { address: '0x1234567890123456789012345678901234567890' }
                    }
                })
            });
            const data = await response.json();
            testResults.push({
                name: 'Verify Source',
                passed: response.ok && data.success,
                details: JSON.stringify(data, null, 2)
            });
        } catch (error: any) {
            testResults.push({
                name: 'Verify Source',
                passed: false,
                details: error.message
            });
        }

        setResults(testResults);
        setTesting(false);
    };

    const passed = results.filter(r => r.passed).length;
    const total = results.length;

    return (
        <div className="container mx-auto p-8 max-w-6xl">
            <div className="space-y-6">
                <div>
                    <h1 className="text-4xl font-bold">MCP Server Testing</h1>
                    <p className="text-muted-foreground mt-2">
                        Test the Genesis MCP server and NullShot framework integration
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>MCP Worker URL</CardTitle>
                        <CardDescription>
                            <code className="text-sm">{MCP_WORKER_URL}</code>
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Test Contract Code</CardTitle>
                        <CardDescription>
                            Edit the contract code below to test security analysis
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={contractCode}
                            onChange={(e) => setContractCode(e.target.value)}
                            className="font-mono text-sm h-64"
                        />
                    </CardContent>
                </Card>

                <Button
                    onClick={runTests}
                    disabled={testing}
                    size="lg"
                    className="w-full"
                >
                    {testing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Running Tests...
                        </>
                    ) : (
                        'Run MCP Tests'
                    )}
                </Button>

                {results.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Test Results</CardTitle>
                            <CardDescription>
                                {passed}/{total} tests passed
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {results.map((result, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">{result.name}</h3>
                                        {result.passed ? (
                                            <Badge variant="default" className="bg-green-500">
                                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                                Passed
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive">
                                                <XCircle className="w-4 h-4 mr-1" />
                                                Failed
                                            </Badge>
                                        )}
                                    </div>
                                    <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-48">
                                        {result.details}
                                    </pre>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Integration Guide</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Using MCP in Your Agent</h3>
                            <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                                {`// Connect to Genesis MCP Server
const mcpClient = new MCPClient('${MCP_WORKER_URL}');

// List available tools
const tools = await mcpClient.listTools();

// Call security analysis
const result = await mcpClient.callTool('analyze_security', {
  source_code: contractCode
});`}
                            </pre>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
