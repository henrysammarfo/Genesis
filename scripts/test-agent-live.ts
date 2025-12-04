#!/usr/bin/env tsx
const MCP_WORKER_URL = 'https://genesis-ai.genesis-ai.workers.dev';

async function testAgentChat() {
    console.log('🤖 Testing AI Agent Chat (LIVE)...\n');

    const sessionId = `test-${Date.now()}`;
    const response = await fetch(`${MCP_WORKER_URL}/agent/chat/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: [{ role: 'user', content: 'Write a simple ERC20 token contract' }]
        })
    });

    console.log('Status:', response.status);

    if (!response.ok) {
        console.log('❌ FAILED:', response.statusText);
        return;
    }

    console.log('✅ Agent responding...\n');

    // Read the stream
    const reader = response.body?.getReader();
    if (!reader) {
        console.log('❌ No response body');
        return;
    }

    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;
        process.stdout.write(chunk);
    }

    console.log('\n\n✅ Agent test PASSED!');
    console.log(`Received ${fullResponse.length} characters`);
}

testAgentChat();
