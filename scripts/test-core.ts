#!/usr/bin/env tsx
const API_URL = 'http://localhost:3000';
const MCP_WORKER_URL = 'https://genesis-ai.genesis-ai.workers.dev';

interface TestResult {
    name: string;
    passed: boolean;
    duration: number;
    error?: string;
}

const testResults: TestResult[] = [];

async function runTest(name: string, testFn: () => Promise<any>): Promise<void> {
    const startTime = Date.now();
    console.log(`\n🧪 ${name}...`);

    try {
        await testFn();
        const duration = Date.now() - startTime;
        testResults.push({ name, passed: true, duration });
        console.log(`   ✅ PASSED (${duration}ms)`);
    } catch (error: any) {
        const duration = Date.now() - startTime;
        testResults.push({ name, passed: false, duration, error: error.message });
        console.log(`   ❌ FAILED (${duration}ms): ${error.message}`);
    }
}

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
    if (!data.success) throw new Error('Analysis failed');
}

async function main() {
    console.log('🚀 LIVE INTEGRATION TESTS - 100% REAL API CALLS\n');
    console.log('='.repeat(60));
    console.log(`API: ${API_URL}`);
    console.log(`MCP: ${MCP_WORKER_URL}\n`);

    console.log('\n🎨 FRONTEND');
    console.log('-'.repeat(60));
    await runTest('Landing Page', testLandingPage);
    await runTest('Dashboard', testDashboard);
    await runTest('Build API', testBuildAPI);

    console.log('\n🔧 MCP SERVER');
    console.log('-'.repeat(60));
    await runTest('Health Check', testMCPHealth);
    await runTest('Tools List', testMCPTools);
    await runTest('Security Analysis', testMCPSecurity);

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESULTS\n');

    const passed = testResults.filter(r => r.passed).length;
    const failed = testResults.filter(r => !r.passed).length;

    console.log(`Total: ${testResults.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);

    if (failed > 0) {
        console.log('\n❌ FAILURES:');
        testResults.filter(r => !r.passed).forEach(r => {
            console.log(`  - ${r.name}: ${r.error}`);
        });
    } else {
        console.log('\n🎉 ALL TESTS PASSED! 100% LIVE & WORKING!');
    }

    console.log('='.repeat(60));
    process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
});
