import * as dotenv from 'dotenv';
import * as path from 'path';
const envPath = path.resolve(__dirname, '../.env.local');
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
    console.error('Error loading .env:', result.error);
} else {
    console.log('Loaded keys:', Object.keys(result.parsed || {}));
}
import { searchTool } from '../src/lib/tools/search';
import { documentTool } from '../src/lib/tools/document';
import * as fs from 'fs';

async function testTools() {
    console.log('=== Testing Advanced AI Tools ===\n');

    // Test Search
    console.log('--- Testing Search Tool ---');
    console.log('TAVILY_API_KEY value:', process.env.TAVILY_API_KEY ? 'SET' : 'NOT SET');
    console.log('TAVILY_API_KEY length:', process.env.TAVILY_API_KEY?.length || 0);
    if (process.env.TAVILY_API_KEY) {
        const searchResult = await searchTool.search('latest ethereum upgrades 2024');
        console.log('Search Result:', searchResult.substring(0, 200) + '...');
    } else {
        console.log('Skipping Search Test (TAVILY_API_KEY not set)');
    }

    // Test Document Reading (Text)
    console.log('\n--- Testing Document Tool (Text) ---');
    const textBuffer = Buffer.from('This is a test document content.', 'utf-8');
    const textContent = await documentTool.readDocument(textBuffer, 'text/plain');
    console.log('Text Content:', textContent);

    // Test Document Reading (PDF - Mock)
    // Note: We'd need a real PDF buffer to test pdf-parse, but we can verify the function exists
    console.log('\n--- Document Tool Initialized ---');
    console.log('Document Tool ready.');

    console.log('\n=== Test Complete ===');
}

testTools().catch(console.error);
