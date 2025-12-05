import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Initialize model with API key from environment
// Support both GEMINI_API_KEY and GOOGLE_GENERATIVE_AI_API_KEY for compatibility
// Load at runtime to support both local (.env.local) and production (env vars)
function getApiKey(): string | null {
    return process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || null;
}

function getModel() {
    const apiKey = getApiKey();
    if (!apiKey) {
        return null;
    }
    try {
        const google = createGoogleGenerativeAI({ apiKey });
        return google('gemini-2.0-flash-exp');
    } catch (error) {
        console.error('Error initializing Google AI model:', error);
        return null;
    }
}

export interface FullStackProject {
    contracts: { name: string; path: string; content: string; language: string }[];
    frontend: { name: string; path: string; content: string; language: string }[];
    backend: { name: string; path: string; content: string; language: string }[];
    config: { name: string; path: string; content: string; language: string }[];
    readme: string;
}

export async function generateFullStackDApp(prompt: string): Promise<FullStackProject> {
    // Get model at runtime to support dynamic env vars
    const model = getModel();
    
    if (!model) {
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error('Google Generative AI API key is missing. Please set GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in your environment variables.\n\nFor local development, create a .env.local file with:\nGEMINI_API_KEY=your_api_key_here');
        }
        throw new Error('Failed to initialize Google AI model. Please check your API key.');
    }

    const systemPrompt = `You are a full-stack Web3 developer generating code for the Genesis platform. Generate a COMPLETE, production-ready dApp with:
1. Smart contracts (Solidity) - fully functional and deployable
2. Frontend (React/Next.js) - complete UI with Web3 integration
3. Backend API (if needed) - fully integrated
4. Configuration files - all dependencies and setup
5. README - brief overview (Genesis handles deployment automatically)

IMPORTANT: 
- Generate COMPLETE, working code - not snippets or examples
- All contracts should be ready to deploy
- Frontend should be fully functional with wallet connection
- Everything should work together automatically
- No instructions to use external tools - Genesis handles everything

Return ONLY valid JSON in this format:
{
  "contracts": [{ "name": "Token.sol", "path": "contracts/Token.sol", "content": "...", "language": "solidity" }],
  "frontend": [{ "name": "App.tsx", "path": "src/App.tsx", "content": "...", "language": "typescript" }],
  "backend": [{ "name": "api.ts", "path": "api/index.ts", "content": "...", "language": "typescript" }],
  "config": [{ "name": "package.json", "path": "package.json", "content": "...", "language": "json" }],
  "readme": "# Project Name\\n\\nSetup instructions..."
}`;

    const result = await generateText({
        model,
        system: systemPrompt,
        prompt: `Generate a complete dApp for: ${prompt}`,
        temperature: 0.7,
    });

    try {
        // Extract JSON from response
        let jsonText = result.text;

        // Remove markdown code blocks if present
        if (jsonText.includes('```json')) {
            jsonText = jsonText.split('```json')[1].split('```')[0].trim();
        } else if (jsonText.includes('```')) {
            jsonText = jsonText.split('```')[1].split('```')[0].trim();
        }

        const project = JSON.parse(jsonText);
        return project;
    } catch (error) {
        console.error('Failed to parse AI response:', error);

        // Fallback: generate basic structure
        return {
            contracts: [{
                name: 'SimpleContract.sol',
                path: 'contracts/SimpleContract.sol',
                content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleContract {
    string public message;
    
    constructor(string memory _message) {
        message = _message;
    }
    
    function setMessage(string memory _message) public {
        message = _message;
    }
}`,
                language: 'solidity'
            }],
            frontend: [{
                name: 'App.tsx',
                path: 'src/App.tsx',
                content: `import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function App() {
  const [message, setMessage] = useState('');
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">My dApp</h1>
      <p>Message: {message}</p>
    </div>
  );
}`,
                language: 'typescript'
            }],
            backend: [],
            config: [{
                name: 'package.json',
                path: 'package.json',
                content: JSON.stringify({
                    name: 'my-dapp',
                    version: '1.0.0',
                    dependencies: {
                        'react': '^18.0.0',
                        'ethers': '^6.0.0'
                    }
                }, null, 2),
                language: 'json'
            }],
            readme: `# My dApp\n\nGenerated with Genesis AI\n\n## Setup\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``
        };
    }
}

export async function generatePlan(prompt: string): Promise<string> {
    const model = getModel();
    if (!model) {
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error('Google Generative AI API key is missing. Please set GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in your environment variables.');
        }
        throw new Error('Failed to initialize Google AI model. Please check your API key.');
    }

    const result = await generateText({
        model,
        system: `You are an expert Web3 architect creating a plan for the Genesis platform. Create a detailed plan for building a dApp.

Include:
1. Project structure
2. Smart contracts needed (with deployment details)
3. Frontend components (with Web3 integration)
4. Backend services (if any)
5. Integration steps (how everything connects)
6. Testing strategy

IMPORTANT: 
- Genesis will automatically generate, deploy, and connect everything
- No need to mention external tools or manual steps
- Focus on what will be created and how it works
- Be specific and actionable

Be specific and actionable.`,
        prompt: `Create a plan for: ${prompt}`,
        temperature: 0.5,
    });

    return result.text;
}

export async function generateSmartContract(description: string): Promise<string> {
    const model = getModel();
    if (!model) {
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error('Google Generative AI API key is missing. Please set GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in your environment variables.');
        }
        throw new Error('Failed to initialize Google AI model. Please check your API key.');
    }

    const result = await generateText({
        model,
        system: `You are an expert Solidity developer. Generate secure, well-documented smart contracts.
Include:
- SPDX license
- Pragma version
- NatSpec comments
- Security best practices
- Events for important state changes`,
        prompt: `Generate a Solidity smart contract for: ${description}`,
        temperature: 0.3,
    });

    return result.text;
}

export async function generateFrontend(description: string, contractABI?: unknown): Promise<string> {
    const model = getModel();
    if (!model) {
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error('Google Generative AI API key is missing. Please set GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in your environment variables.');
        }
        throw new Error('Failed to initialize Google AI model. Please check your API key.');
    }

    const result = await generateText({
        model,
        system: `You are an expert React/Next.js developer. Generate modern, responsive frontend code.
Use:
- TypeScript
- Tailwind CSS
- ethers.js for Web3 integration
- React hooks
- Clean, maintainable code`,
        prompt: `Generate a React component for: ${description}${contractABI ? `\n\nContract ABI: ${JSON.stringify(contractABI)}` : ''}`,
        temperature: 0.5,
    });

    return result.text;
}
