import * as dotenv from 'dotenv';
import * as path from 'path';
import { genesisAgent } from '../src/lib/agents/nullshot-agent';
import { convertToCoreMessages } from 'ai';

// Load environment variables
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

async function testAgent() {
    console.log('=== Testing NullShot-Compatible Agent ===');

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY not found');
        return;
    }

    const messages = [
        { role: 'user', content: 'What are the latest ethereum upgrades? Search the web.' }
    ];

    try {
        console.log('Sending request to agent...');
        const result = await genesisAgent.processMessage(messages as any);

        console.log('Agent response stream:');
        for await (const chunk of result.textStream) {
            process.stdout.write(chunk);
        }
        console.log('\n\n✅ Test Complete');
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testAgent();
