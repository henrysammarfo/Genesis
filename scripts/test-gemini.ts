import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = process.env.GEMINI_API_KEY;
console.log('Testing API Key:', apiKey ? 'Present' : 'Missing');

if (!apiKey) {
    console.error('Error: GEMINI_API_KEY is missing in .env.local');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName: string) {
    console.log(`\nTesting model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello, are you working?');
        const response = result.response;
        console.log(`✅ Success! Response: ${response.text()}`);
        fs.writeFileSync('api_test_result.txt', `SUCCESS:${modelName}`);
        return true;
    } catch (error: any) {
        console.error(`❌ Failed: ${error.message}`);
        fs.writeFileSync('api_test_result.txt', `FAILURE:${modelName}:${error.message}`);
        return false;
    }
}

testModel('gemini-2.0-flash');
