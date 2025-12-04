#!/usr/bin/env tsx
const MCP_WORKER_URL = 'https://genesis-ai.genesis-ai.workers.dev';

async function test() {
    console.log('Testing MCP Security Analysis...\n');

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

    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    const text = await response.text();
    console.log('\nResponse Body:');
    console.log(text);

    try {
        const json = JSON.parse(text);
        console.log('\nParsed JSON:');
        console.log(JSON.stringify(json, null, 2));
    } catch (e) {
        console.log('\nNot valid JSON');
    }
}

test();
