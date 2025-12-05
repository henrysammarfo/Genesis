import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, CoreMessage } from 'ai';

// Real AI Agent - NO MOCK DATA
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
    console.error('⚠️ GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY not found');
}

const google = apiKey ? createGoogleGenerativeAI({ apiKey }) : null;
const model = google ? google('gemini-2.0-flash') : null;

export class GenesisAgent {
    async processMessage(messages: CoreMessage[]) {
        if (!model) {
            throw new Error('Google AI API key is missing. Configure GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY.');
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
            return result.toTextStreamResponse();
        } catch (error) {
            console.error('Error in GenesisAgent:', error);
            throw error;
        }
    }
}

export const genesisAgent = new GenesisAgent();
