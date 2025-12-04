#!/usr/bin/env tsx
/**
 * Genesis - MCP Server Integration Test Script
 * Tests the Model Context Protocol server and tools
 */

interface TestResult {
    name: string;
    passed: boolean;
    duration: number;
    error?: string;
    output?: any;
}

const results: TestResult[] = [];

// MCP Worker URL (update this with your deployed worker URL)
const MCP_WORKER_URL = process.env.MCP_WORKER_URL || 'http://localhost:8787';

async function runTest(name: string, testFn: () => Promise<any>): Promise<void> {
    const startTime = Date.now();
    console.log(`\n🧪 Running: ${name}...`);

    try {
        const output = await testFn();
        const duration = Date.now() - startTime;
        results.push({ name, passed: true, duration, output });
        console.log(`✅ PASSED (${duration}ms)`);
    } catch (error: any) {
        const duration = Date.now() - startTime;
        results.push({ name, passed: false, duration, error: error.message });
        console.log(`❌ FAILED (${duration}ms): ${error.message}`);
    }
}

async function testMCPServerHealth() {
    const response = await fetch(`${MCP_WORKER_URL}/health`);

    if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
    }

    const data: any = await response.json();

    if (data.status !== 'healthy') {
        throw new Error('MCP server reported unhealthy status');
    }

    return data;
}

async function testMCPToolsList() {
    const response = await fetch(`${MCP_WORKER_URL}/mcp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/list'
        })
    });

    if (!response.ok) {
        throw new Error(`Tools list failed: ${response.status}`);
    }

    const data: any = await response.json();

    if (!data.result || !data.result.tools) {
        throw new Error('No tools returned from MCP server');
    }

    const expectedTools = ['deploy_contract', 'verify_source', 'analyze_security'];
    const actualTools = data.result.tools.map((t: any) => t.name);

    for (const tool of expectedTools) {
        if (!actualTools.includes(tool)) {
            throw new Error(`Missing expected tool: ${tool}`);
        }
    }

    return { toolCount: data.result.tools.length, tools: actualTools };
}

async function testDeployContractTool() {
    // Simple ERC20 contract for testing
    const testContract = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestToken {
    string public name = "Test Token";
    string public symbol = "TST";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18;
    
    mapping(address => uint256) public balanceOf;
    
    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }
}
  `.trim();

    const response = await fetch(`${MCP_WORKER_URL}/mcp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/call',
            params: {
                name: 'deploy_contract',
                arguments: {
                    contractCode: testContract,
                    contractName: 'TestToken'
                }
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Deploy contract tool failed: ${response.status}`);
    }

    const data: any = await response.json();

    if (data.error) {
        throw new Error(`Deploy contract error: ${data.error.message}`);
    }

    if (!data.result || !data.result.content) {
        throw new Error('No deployment result returned');
    }

    return { deployed: true, result: data.result.content[0].text };
}

async function testAnalyzeSecurityTool() {
    const testContract = `
pragma solidity ^0.8.0;

contract VulnerableContract {
    mapping(address => uint256) public balances;
    
    function withdraw() public {
        uint256 amount = balances[msg.sender];
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
        balances[msg.sender] = 0; // Reentrancy vulnerability!
    }
}
  `.trim();

    const response = await fetch(`${MCP_WORKER_URL}/mcp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 3,
            method: 'tools/call',
            params: {
                name: 'analyze_security',
                arguments: {
                    contractCode: testContract
                }
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Analyze security tool failed: ${response.status}`);
    }

    const data: any = await response.json();

    if (data.error) {
        throw new Error(`Security analysis error: ${data.error.message}`);
    }

    const analysis = data.result.content[0].text.toLowerCase();

    // Should detect reentrancy vulnerability
    if (!analysis.includes('reentrancy') && !analysis.includes('vulnerability')) {
        console.warn('⚠️  Security analysis may not have detected reentrancy vulnerability');
    }

    return { analyzed: true, foundIssues: analysis.includes('vulnerability') };
}

async function testAgentSession() {
    // Test creating an agent session
    const response = await fetch(`${MCP_WORKER_URL}/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt: 'Create a simple storage contract',
            stream: false
        })
    });

    if (!response.ok) {
        throw new Error(`Agent session failed: ${response.status}`);
    }

    const data: any = await response.json();

    if (!data.contractCode) {
        throw new Error('No contract code generated');
    }

    return {
        generated: true,
        codeLength: data.contractCode.length,
        hasFiles: !!data.files && Object.keys(data.files).length > 0
    };
}

async function main() {
    console.log('🚀 Genesis MCP Server Integration Tests\n');
    console.log('='.repeat(60));
    console.log(`MCP Worker URL: ${MCP_WORKER_URL}\n`);

    // Run all tests
    await runTest('MCP Server - Health Check', testMCPServerHealth);
    await runTest('MCP Server - Tools List', testMCPToolsList);
    await runTest('MCP Tool - Deploy Contract', testDeployContractTool);
    await runTest('MCP Tool - Analyze Security', testAnalyzeSecurityTool);
    await runTest('Agent Session - Contract Generation', testAgentSession);

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Test Summary\n');

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`Total Tests: ${results.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);

    if (failed > 0) {
        console.log('\n❌ Failed Tests:');
        results.filter(r => !r.passed).forEach(r => {
            console.log(`  - ${r.name}: ${r.error}`);
        });
    }

    console.log('\n' + '='.repeat(60));

    // Exit with appropriate code
    process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
    console.error('💥 Test suite failed:', error);
    process.exit(1);
});
