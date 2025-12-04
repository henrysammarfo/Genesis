#!/usr/bin/env tsx
/**
 * Genesis - AI Agent Integration Test Script
 * Tests the multi-agent orchestration system end-to-end
 */

import { AgentOrchestrator } from '../src/lib/agents/orchestrator';
import { SearchTool } from '../src/lib/tools/search';
import { DocumentTool } from '../src/lib/tools/document';

interface TestResult {
    name: string;
    passed: boolean;
    duration: number;
    error?: string;
    output?: any;
}

const results: TestResult[] = [];

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

async function testArchitectAgent() {
    const orchestrator = new AgentOrchestrator();
    const prompt = "Create a simple ERC20 token with 1 million supply";

    // Test planning phase
    const plan = await orchestrator.planContract(prompt);

    if (!plan || plan.length < 50) {
        throw new Error('Architect agent failed to generate adequate plan');
    }

    return { planLength: plan.length, preview: plan.substring(0, 100) };
}

async function testEngineerAgent() {
    const orchestrator = new AgentOrchestrator();
    const prompt = "Create an ERC20 token called TestToken with symbol TST";

    // Test code generation
    const result = await orchestrator.generateContract(prompt);

    if (!result.contractCode || !result.contractCode.includes('pragma solidity')) {
        throw new Error('Engineer agent failed to generate valid Solidity code');
    }

    if (!result.contractCode.includes('ERC20') && !result.contractCode.includes('token')) {
        throw new Error('Generated contract does not appear to be an ERC20 token');
    }

    return {
        codeLength: result.contractCode.length,
        hasConstructor: result.contractCode.includes('constructor'),
        hasPragma: result.contractCode.includes('pragma solidity')
    };
}

async function testSearchTool() {
    const searchTool = new SearchTool();

    const results = await searchTool.search('Ethereum ERC20 token standard');

    if (!results || results.length === 0) {
        throw new Error('Search tool returned no results');
    }

    return { resultCount: results.length, firstResult: results[0].substring(0, 100) };
}

async function testDocumentTool() {
    const documentTool = new DocumentTool();

    // Test with a simple text document
    const testContent = "This is a test document for Genesis AI agent system";
    const buffer = Buffer.from(testContent);

    const result = await documentTool.readDocument(buffer, 'test.txt');

    if (!result.includes('test document')) {
        throw new Error('Document tool failed to read text content');
    }

    return { contentLength: result.length };
}

async function testFullOrchestration() {
    const orchestrator = new AgentOrchestrator();
    const prompt = "Build a simple NFT contract with minting function";

    // Test full orchestration (without deployment)
    const result = await orchestrator.generateContract(prompt);

    if (!result.contractCode) {
        throw new Error('Full orchestration failed to generate contract');
    }

    if (!result.files || Object.keys(result.files).length === 0) {
        throw new Error('Full orchestration failed to generate UI files');
    }

    return {
        contractGenerated: !!result.contractCode,
        uiFilesCount: Object.keys(result.files).length,
        fileNames: Object.keys(result.files)
    };
}

async function testStreamingResponse() {
    const orchestrator = new AgentOrchestrator();
    const prompt = "Create a simple voting contract";

    let statusUpdates = 0;
    const onStatus = (agent: string, message: string) => {
        statusUpdates++;
        console.log(`  📡 ${agent}: ${message}`);
    };

    const result = await orchestrator.generateContract(prompt, { onStatus });

    if (statusUpdates === 0) {
        throw new Error('No status updates received during streaming');
    }

    return { statusUpdates, contractGenerated: !!result.contractCode };
}

async function main() {
    console.log('🚀 Genesis AI Agent Integration Tests\n');
    console.log('='.repeat(60));

    // Run all tests
    await runTest('Architect Agent - Contract Planning', testArchitectAgent);
    await runTest('Engineer Agent - Code Generation', testEngineerAgent);
    await runTest('Search Tool - Web Search', testSearchTool);
    await runTest('Document Tool - File Reading', testDocumentTool);
    await runTest('Full Orchestration - End-to-End', testFullOrchestration);
    await runTest('Streaming Response - Real-time Updates', testStreamingResponse);

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
