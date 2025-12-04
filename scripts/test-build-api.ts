#!/usr/bin/env tsx
/**
 * Test the main Build API (what the dashboard uses)
 */

async function testBuildAPI() {
    console.log('🤖 Testing Build API Agent (Dashboard endpoint)...\n');

    const response = await fetch('http://localhost:3000/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt: 'Create a simple ERC20 token contract',
            stream: false
        })
    });

    console.log('Status:', response.status);

    if (response.status === 401) {
        console.log('✅ Endpoint requires authentication (as expected)');
        console.log('✅ Build API is LIVE and protected');
        return;
    }

    if (!response.ok) {
        console.log('❌ FAILED:', response.statusText);
        const text = await response.text();
        console.log('Response:', text);
        return;
    }

    const data = await response.json();
    console.log('\n✅ Build API WORKING!');
    console.log('Response keys:', Object.keys(data));
}

testBuildAPI();
