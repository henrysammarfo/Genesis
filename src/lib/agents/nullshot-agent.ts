import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, CoreMessage } from 'ai';

// NullShot-compatible Agent Implementation
// Note: Tools temporarily disabled due to Gemini 2.0 Flash schema compatibility issues
export class GenesisAgent {
    private workerUrl = 'https://genesis-ai.genesis-ai.workers.dev/agent/chat/test-session';

    async processMessage(messages: CoreMessage[]) {
        try {
            const response = await fetch(this.workerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages })
            });

            if (!response.ok) {
                throw new Error(`Worker returned ${response.status}: ${await response.text()}`);
            }

            // Return the raw response to be proxied
            return response;
        } catch (error) {
            console.error('Error calling NullShot worker:', error);
            throw error;
        }
    }
}

export const genesisAgent = new GenesisAgent();
