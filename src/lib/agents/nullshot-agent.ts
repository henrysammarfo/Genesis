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
                system: `You are Genesis, an expert AI assistant for building decentralized applications (dApps).
You help users build complete Web3 projects including:
- Smart contracts (Solidity)
- Frontend interfaces (React/Next.js)
- Backend APIs
- Full-stack dApps

Provide helpful, accurate, and comprehensive responses. Be conversational and friendly, but always professional.
When users describe what they want to build, guide them through the process.`,
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
