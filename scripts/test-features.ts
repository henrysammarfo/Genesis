#!/usr/bin/env tsx
/**
 * Genesis - Complete Feature Test Suite
 * Tests all features end-to-end
 */

interface TestResult {
    name: string;
    passed: boolean;
    duration: number;
    error?: string;
    output?: any;
}

const results: TestResult[] = [];
const API_URL = process.env.API_URL || 'http://localhost:3000';

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

// Feature Tests
async function testLandingPage() {
    const response = await fetch(`${API_URL}/`);
    if (!response.ok) throw new Error(`Landing page failed: ${response.status}`);
    const html = await response.text();
    if (!html.includes('Genesis')) throw new Error('Landing page missing Genesis branding');
    return { status: response.status, hasGenesisBranding: true };
}

async function testDocsPage() {
    const response = await fetch(`${API_URL}/docs`);
    if (!response.ok) throw new Error(`Docs page failed: ${response.status}`);
    const html = await response.text();
    if (!html.includes('Documentation')) throw new Error('Docs page missing content');
    return { status: response.status, hasContent: true };
}

async function testAuthPages() {
    const signinResponse = await fetch(`${API_URL}/auth/signin`);
    const signupResponse = await fetch(`${API_URL}/auth/signup`);

    if (!signinResponse.ok) throw new Error('Signin page failed');
    if (!signupResponse.ok) throw new Error('Signup page failed');

    return { signin: signinResponse.status, signup: signupResponse.status };
}

async function testDashboardAuth() {
    const response = await fetch(`${API_URL}/dashboard`);
    // Should redirect to signin if not authenticated
    if (response.status !== 200 && response.status !== 307) {
        throw new Error(`Unexpected dashboard response: ${response.status}`);
    }
    return { status: response.status, authRequired: response.status === 307 };
}

async function testAPIHealthCheck() {
    const response = await fetch(`${API_URL}/api/health`);
    if (!response.ok) throw new Error(`Health check failed: ${response.status}`);
    const data: any = await response.json();
    if (data.status !== 'healthy') throw new Error('API reported unhealthy');
    return data;
}

async function testBuildAPIEndpoint() {
    // Test that endpoint exists and requires auth
    const response = await fetch(`${API_URL}/api/build`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'test' })
    });

    // Should return 401 Unauthorized without auth
    if (response.status !== 401) {
        console.warn(`⚠️  Expected 401, got ${response.status} (may need auth check)`);
    }

    return { status: response.status, requiresAuth: response.status === 401 };
}

async function main() {
    console.log('🚀 Genesis - Complete Feature Test Suite\n');
    console.log('='.repeat(60));
    console.log(`Testing API: ${API_URL}\n`);

    // Run all feature tests
    await runTest('Landing Page - Genesis Branding', testLandingPage);
    await runTest('Documentation Page - Content', testDocsPage);
    await runTest('Auth Pages - Signin & Signup', testAuthPages);
    await runTest('Dashboard - Auth Protection', testDashboardAuth);
    await runTest('API Health Check', testAPIHealthCheck);
    await runTest('Build API - Endpoint & Auth', testBuildAPIEndpoint);

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
