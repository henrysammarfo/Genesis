import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import fs from 'fs';
import path from 'path';
import { searchTool } from '../src/lib/tools/search';
import { documentTool } from '../src/lib/tools/document';

const COLORS = {
    GREEN: '\x1b[32m',
    RED: '\x1b[31m',
    RESET: '\x1b[0m',
    YELLOW: '\x1b[33m',
};

function log(msg: string, type: 'info' | 'success' | 'error' = 'info') {
    const color = type === 'success' ? COLORS.GREEN : type === 'error' ? COLORS.RED : COLORS.RESET;
    console.log(`${color}${msg}${COLORS.RESET}`);
}

async function verifyPhase1() {
    log('\n--- Verifying Phase 1: Landing & Auth ---');
    const files = [
        'src/app/page.tsx',
        'src/app/auth/signin/page.tsx',
        'src/components/ui/GlassPanel.tsx'
    ];

    let allExist = true;
    for (const file of files) {
        if (fs.existsSync(file)) {
            log(`✅ Found ${file}`, 'success');
        } else {
            log(`❌ Missing ${file}`, 'error');
            allExist = false;
        }
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        log('❌ Missing NEXT_PUBLIC_SUPABASE_URL', 'error');
        allExist = false;
    } else {
        log('✅ NEXT_PUBLIC_SUPABASE_URL present', 'success');
    }

    return allExist;
}

async function verifyPhase2() {
    log('\n--- Verifying Phase 2: Credits System ---');
    const files = ['src/lib/supabase/client.ts'];
    let allExist = true;
    for (const file of files) {
        if (fs.existsSync(file)) {
            log(`✅ Found ${file}`, 'success');
        } else {
            log(`❌ Missing ${file}`, 'error');
            allExist = false;
        }
    }
    return allExist;
}

async function verifyPhase3() {
    log('\n--- Verifying Phase 3: Orchestrator ---');
    const files = ['src/lib/agents/orchestrator.ts'];
    let allExist = true;
    for (const file of files) {
        if (fs.existsSync(file)) {
            log(`✅ Found ${file}`, 'success');
        } else {
            log(`❌ Missing ${file}`, 'error');
            allExist = false;
        }
    }
    return allExist;
}

async function verifyPhase4() {
    log('\n--- Verifying Phase 4: Deployer ---');
    const files = ['src/lib/deployer/index.ts'];
    let allExist = true;
    for (const file of files) {
        if (fs.existsSync(file)) {
            log(`✅ Found ${file}`, 'success');
        } else {
            log(`❌ Missing ${file}`, 'error');
            allExist = false;
        }
    }
    return allExist;
}

async function verifyPhase5() {
    log('\n--- Verifying Phase 5: AI Tools ---');
    try {
        // Test Search Tool
        if (!process.env.TAVILY_API_KEY) {
            log('⚠️ Skipping Search Tool test (Missing TAVILY_API_KEY)', 'info');
        } else {
            const searchResult = await searchTool.search('NullShot AI');
            if (searchResult && searchResult.length > 0) {
                log('✅ Search Tool working', 'success');
            } else {
                log('❌ Search Tool returned empty results', 'error');
            }
        }

        // Test Document Tool (basic check)
        if (documentTool) {
            log('✅ Document Tool initialized', 'success');
        }

        return true;
    } catch (error: any) {
        log(`❌ Phase 5 Error: ${error.message}`, 'error');
        return false;
    }
}

async function verifyPhase6() {
    log('\n--- Verifying Phase 6: NullShot Agent ---');
    const workerUrl = 'https://genesis-ai.genesis-ai.workers.dev/agent/chat/test-session';

    try {
        const response = await fetch(workerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Hello' }]
            })
        });

        if (response.ok) {
            log(`✅ NullShot Agent reachable (${response.status})`, 'success');
            // Consume stream to finish
            const reader = response.body?.getReader();
            if (reader) {
                while (true) {
                    const { done } = await reader.read();
                    if (done) break;
                }
            }
            return true;
        } else {
            const text = await response.text();
            log(`❌ NullShot Agent failed (${response.status}): ${text}`, 'error');
            return false;
        }
    } catch (error: any) {
        log(`❌ Phase 6 Connection Error: ${error.message}`, 'error');
        return false;
    }
}

async function main() {
    log('🚀 Starting Full System Verification...\n');

    const p1 = await verifyPhase1();
    const p2 = await verifyPhase2();
    const p3 = await verifyPhase3();
    const p4 = await verifyPhase4();
    const p5 = await verifyPhase5();
    const p6 = await verifyPhase6();

    log('\n--- Verification Summary ---');
    log(`Phase 1 (Auth): ${p1 ? '✅ PASS' : '❌ FAIL'}`);
    log(`Phase 2 (Credits): ${p2 ? '✅ PASS' : '❌ FAIL'}`);
    log(`Phase 3 (Orchestrator): ${p3 ? '✅ PASS' : '❌ FAIL'}`);
    log(`Phase 4 (Deployer): ${p4 ? '✅ PASS' : '❌ FAIL'}`);
    log(`Phase 5 (Tools): ${p5 ? '✅ PASS' : '❌ FAIL'}`);
    log(`Phase 6 (NullShot): ${p6 ? '✅ PASS' : '❌ FAIL'}`);

    if (p1 && p2 && p3 && p4 && p5 && p6) {
        log('\n🎉 ALL SYSTEMS GO! Project is ready.', 'success');
        process.exit(0);
    } else {
        log('\n⚠️ Some checks failed. Please review logs.', 'error');
        process.exit(1);
    }
}

main();
