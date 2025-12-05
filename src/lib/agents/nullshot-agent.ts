import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, CoreMessage } from 'ai';

// Real AI Agent - NO MOCK DATA
// Initialize at runtime to support both local (.env.local) and production (env vars)
function getApiKey(): string | null {
    // Support both environment variable names for flexibility
    return process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || null;
}

function getModel() {
    const apiKey = getApiKey();
    if (!apiKey) {
        return null;
    }
    try {
        const google = createGoogleGenerativeAI({ apiKey });
        return google('gemini-2.0-flash');
    } catch (error) {
        console.error('Error initializing Google AI model:', error);
        return null;
    }
}

export class GenesisAgent {
    async processMessage(messages: CoreMessage[]) {
        // Get model at runtime to support dynamic env vars
        const model = getModel();
        
        if (!model) {
            const apiKey = getApiKey();
            if (!apiKey) {
                throw new Error('Google AI API key is missing. Please set GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in your environment variables.\n\nFor local development, create a .env.local file with:\nGEMINI_API_KEY=your_api_key_here');
            }
            throw new Error('Failed to initialize Google AI model. Please check your API key.');
        }

        try {
            // Use real AI for all conversations
            const result = await streamText({
                model,
                messages,
                system: `You are Genesis, an AI assistant that builds complete dApps automatically within the Genesis platform.

CRITICAL RULES:
1. NEVER mention external tools like Remix IDE, Hardhat CLI, Truffle, or any other external development tools
2. NEVER give instructions to "go to Remix" or "use Hardhat" or "deploy manually"
3. Genesis platform handles EVERYTHING automatically: code generation, contract deployment, frontend creation, and integration
4. When users say "create X" or "build X", acknowledge it and let them know Genesis will handle everything
5. The ONLY things users need to do are:
   - Approve the generated plan
   - Provide ENV keys when asked (in Settings)
   - Give feedback or request changes
   - Fix errors if any occur
6. Everything else (generation, deployment, connection) happens automatically in Genesis
7. Be conversational, friendly, and professional
8. Focus on what Genesis will create, not external steps

When users describe what they want to build, acknowledge it and let them know Genesis will automatically:
- Generate the smart contracts
- Create the frontend
- Deploy everything
- Connect all components
- Make it ready to use

Just like Bold.new or v0.dev - everything happens automatically in the platform.`,
                temperature: 0.7
            });

            // Return the text stream response as Response object
            // Use toTextStreamResponse for edge runtime compatibility
            if (typeof result.toTextStreamResponse === 'function') {
                return result.toTextStreamResponse();
            } else {
                // Fallback if method doesn't exist (shouldn't happen, but safety check)
                throw new Error('Streaming response method not available. Please check AI SDK version.');
            }
        } catch (error: any) {
            console.error('Error in GenesisAgent:', error);
            
            // Handle API key errors with user-friendly messages
            if (error?.message?.includes('leaked') || error?.message?.includes('API key')) {
                throw new Error('Google AI API key is invalid or has been revoked. Please update your GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in your .env.local file (for local) or environment variables (for production) with a valid API key.');
            }
            
            if (error?.message?.includes('quota') || error?.message?.includes('Quota')) {
                throw new Error('Google AI API quota exceeded. Please check your usage limits or wait before trying again.');
            }
            
            throw error;
        }
    }
}

export const genesisAgent = new GenesisAgent();
