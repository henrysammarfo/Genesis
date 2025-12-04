#!/usr/bin/env tsx
/**
 * COMPLETE INTEGRATION TEST SUITE
 * Tests ALL features: Core, Agents, MCP
 */

const API_URL = 'http://localhost:3000';
const MCP_WORKER_URL = 'https://genesis-ai.genesis-ai.workers.dev';

interface TestResult {
    category: string;
    name: string;
    passed: boolean;
    duration: number;
    error?: string;
}

const allResults: TestResult[] = [];

async function runTest(category: string, name: string, testFn: () => Promise<any>): Promise<void> {
    const startTime = Date.now();
    console.log(`\n🧪 [${category}] ${name}...`);

    try {
        await testFn();
        const duration = Date.now() - startTime;
        allResults.push({ category, name, passed: true, duration });
        console.log(`   ✅ PASSED (${duration}ms)`);
    } catch (error: any) {
        const duration = Date.now() - startTime;
        allResults.push({ category, name, passed: false, duration, error: error.message });
        console.log(`   ❌ FAILED (${duration}ms): ${error.message}`);
    }
}

// CORE TESTS
async function testLandingPage() {
    const response = await fetch(`${API_URL}/`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    if (!html.includes('Genesis')) throw new Error('Missing Genesis branding');
}

async function testDashboard() {
    const response = await fetch(`${API_URL}/dashboard`);
    if (response.status !== 200 && response.status !== 307) {
        throw new Error(`Unexpected status: ${response.status}`);
    }
}

async function testBuildAPI() {
    const response = await fetch(`${API_URL}/api/build`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'test' })
    });
    if (response.status !== 401 && !response.ok) {
        throw new Error(`Unexpected status: ${response.status}`);
    }
}

// MCP TESTS
async function testMCPHealth() {
    const response = await fetch(`${MCP_WORKER_URL}/health`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: any = await response.json();
    if (data.status !== 'healthy') throw new Error('Unhealthy');
}

async function testMCPTools() {
    const response = await fetch(`${MCP_WORKER_URL}/mcp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: any = await response.json();
    if (!data.tools || data.tools.length === 0) throw new Error('No tools');
}

async function testMCPSecurity() {
    const response = await fetch(`${MCP_WORKER_URL}/mcp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/call',
            params: {
                name: 'analyze_security',
                arguments: { source_code: 'pragma solidity ^0.8.0; contract Test {}' }
            }
        })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: any = await response.json();
    if (data.error) throw new Error(data.error.message || 'Failed');
}

async function testMCPVerify() {
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
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: any = await response.json();
    if (data.error) throw new Error(data.error.message || 'Failed');
}

// AGENT TEST
async function testAgentChat() {
    const sessionId = `test-${Date.now()}`;
    const response = await fetch(`${MCP_WORKER_URL}/agent/chat/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: [{ role: 'user', content: 'Say hello' }]
        })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    // Read stream
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No body');

    const { value } = await reader.read();
    if (!value || value.length === 0) throw new Error('No data');

    reader.releaseLock();
}

async function main() {
    console.log('🚀 COMPLETE INTEGRATION TEST SUITE\n');
    console.log('='.repeat(70));
    console.log(`API: ${API_URL}`);
    console.log(`MCP: ${MCP_WORKER_URL}\n`);

    // CORE
    console.log('\n🎨 CORE FEATURES');
    console.log('-'.repeat(70));
    await runTest('CORE', 'Landing Page', testLandingPage);
    await runTest('CORE', 'Dashboard', testDashboard);
    await runTest('CORE', 'Build API', testBuildAPI);

    // MCP
    console.log('\n🔧 MCP SERVER');
    allResults.forEach(r => {
        if (!byCategory[r.category]) byCategory[r.category] = { passed: 0, failed: 0 };
        r.passed ? byCategory[r.category].passed++ : byCategory[r.category].failed++;
    });

    Object.entries(byCategory).forEach(([cat, stats]: [string, any]) => {
        console.log(`${cat}: ✅ ${stats.passed} passed, ❌ ${stats.failed} failed`);
    });

    const passed = allResults.filter(r => r.passed).length;
    const failed = allResults.filter(r => !r.passed).length;

    console.log(`\nTotal: ${allResults.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);

    if (failed > 0) {
        console.log('\n❌ FAILURES:');
        allResults.filter(r => !r.passed).forEach(r => {
            console.log(`  [${r.category}] ${r.name}: ${r.error}`);
        });
    }

    console.log('\n' + '='.repeat(70));

    if (failed === 0) {
        console.log('🎉 ALL TESTS PASSED! Ready for production!');
    } else {
        console.log(`⚠️  ${failed} test(s) failed.`);
    }

    console.log('='.repeat(70));

    process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
});
