#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function diagnose() {
    console.log('🔍 DIAGNOSTIC RUN');
    console.log('-----------------');

    // 1. Check Supabase Projects Table
    console.log('\n1. Checking Supabase Projects Table...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase.from('projects').select('count').limit(1);

    if (error) {
        console.log('❌ Error accessing projects table:');
        console.log(JSON.stringify(error, null, 2));
    } else {
        console.log('✅ Projects table accessible (Data: ' + JSON.stringify(data) + ')');
    }

    // 2. Check MCP Worker
    console.log('\n2. Checking MCP Worker...');
    // Try to find the worker URL from wrangler output or guess it
    const workerName = 'genesis-ai';
    // Try common variations
    const urls = [
        'https://genesis-ai.henrysammarfo.workers.dev',
        'https://genesis-ai-nullshot.henrysammarfo.workers.dev',
        'https://genesis-nullshot-worker.henrysammarfo.workers.dev'
    ];

    for (const url of urls) {
        console.log(`   Trying ${url}...`);
        try {
            const res = await fetch(`${url}/health`);
            if (res.ok) {
                console.log(`   ✅ FOUND! Worker is active at: ${url}`);
                console.log(`   Response: ${await res.text()}`);
                return;
            } else {
                console.log(`   ❌ Status: ${res.status}`);
            }
        } catch (e: any) {
            console.log(`   ❌ Error: ${e.message}`);
        }
    }
}

diagnose();
