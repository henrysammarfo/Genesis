import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchTool } from '@/lib/tools/search';
import { documentTool } from '@/lib/tools/document';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface AgentMessage {
    role: 'architect' | 'engineer' | 'deployer' | 'designer';
    content: string;
    timestamp: number;
}

export interface BuildRequest {
    prompt: string;
    files?: { name: string; type: string; content: string }[]; // Base64 content
    useSearch?: boolean;
}

export interface VirtualFile {
    content: string;
    language: string;
}

export interface VirtualFileSystem {
    [path: string]: VirtualFile;
}

export interface TokenUsage {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
}

export interface BuildResponse {
    success: boolean;
    messages: AgentMessage[];
    contract?: {
        code: string;
        address?: string;
    };
    files?: VirtualFileSystem;
    tokenUsage?: TokenUsage;
    error?: string;
}

export class AgentOrchestrator {
    private model;

    constructor() {
        this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }

    async plan(prompt: string): Promise<{ summary: string }> {
        const architectPrompt = `You are an expert blockchain architect. Analyze this request and create a concise technical plan summary (max 2 sentences).
Request: "${prompt}"`;

        const result = await this.model.generateContent(architectPrompt);
        return { summary: result.response.text() };
    }

    private cleanCode(text: string): string {
        return text
            .replace(/```solidity\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
    }

    private cleanJSON(text: string): any {
        const cleanJson = text
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
        return JSON.parse(cleanJson);
    }

    async buildDApp(request: BuildRequest): Promise<BuildResponse> {
        const messages: AgentMessage[] = [];
        let totalInputTokens = 0;
        let totalOutputTokens = 0;

        try {
            // Step 0: Gather Context (Search & Docs)
            let context = '';

            if (request.useSearch) {
                messages.push({
                    role: 'architect',
                    content: 'Searching the web for relevant information...',
                    timestamp: Date.now(),
                });
                const searchResults = await searchTool.search(request.prompt);
                context += `\n\nWeb Search Results:\n${searchResults}`;
            }

            if (request.files && request.files.length > 0) {
                messages.push({
                    role: 'architect',
                    content: `Reading ${request.files.length} uploaded document(s)...`,
                    timestamp: Date.now(),
                });

                for (const file of request.files) {
                    const buffer = Buffer.from(file.content, 'base64');
                    const text = await documentTool.readDocument(buffer, file.type);
                    context += `\n\nDocument Content (${file.name}):\n${text.substring(0, 2000)}...`; // Limit context
                }
            }

            // Step 1: Architect Agent - Plan the dApp
            messages.push({
                role: 'architect',
                content: 'Analyzing requirements and planning architecture...',
                timestamp: Date.now(),
            });

            const architectPrompt = `You are an expert blockchain architect. Analyze this request and create a technical plan:
Request: "${request.prompt}"

Additional Context:
${context}

Provide:
1. Contract type (ERC20, ERC721, Staking, DAO, etc.)
2. Key functions needed
3. Security considerations
4. UI requirements

Be concise and technical.`;

            const architectResult = await this.model.generateContent(architectPrompt);
            const plan = architectResult.response.text();

            // Track token usage
            const architectUsage = architectResult.response.usageMetadata;
            if (architectUsage) {
                totalInputTokens += architectUsage.promptTokenCount || 0;
                totalOutputTokens += architectUsage.candidatesTokenCount || 0;
            }

            messages.push({
                role: 'architect',
                content: `Plan complete: ${plan.substring(0, 100)}...`,
                timestamp: Date.now(),
            });

            // Step 2: Engineer Agent - Write Solidity
            messages.push({
                role: 'engineer',
                content: 'Writing Solidity smart contract...',
                timestamp: Date.now(),
            });

            const engineerPrompt = `You are an expert Solidity developer. Based on this plan, write a complete, secure smart contract:

Plan: ${plan}

Requirements:
- Use Solidity 0.8.20+
- Include all necessary imports (OpenZeppelin etc.)
- Add NatSpec comments
- Follow best practices
- Make it production-ready

Return ONLY the Solidity code, no explanations.`;

            const engineerResult = await this.model.generateContent(engineerPrompt);
            const solidityCode = this.cleanCode(engineerResult.response.text());

            // Track token usage
            const engineerUsage = engineerResult.response.usageMetadata;
            if (engineerUsage) {
                totalInputTokens += engineerUsage.promptTokenCount || 0;
                totalOutputTokens += engineerUsage.candidatesTokenCount || 0;
            }

            messages.push({
                role: 'engineer',
                content: 'Smart contract written successfully',
                timestamp: Date.now(),
            });

            // Step 3: Designer Agent - Generate UI (VFS)
            messages.push({
                role: 'designer',
                content: 'Generating React UI & File System...',
                timestamp: Date.now(),
            });

            const designerPrompt = `You are an expert React developer. Create a complete, multi-file React application for this smart contract.

Contract: ${solidityCode.substring(0, 500)}...

Requirements:
1.  **Structure**: Return a JSON object representing a Virtual File System.
2.  **Files**:
    -   \`/App.js\`: Main entry point.
    -   \`/components/WalletConnect.js\`: Wallet connection component.
    -   \`/components/ContractInteraction.js\`: Main interaction logic.
    -   \`/styles.css\`: Beautiful "Cyber-Noir" styling (Dark mode, neon accents).
3.  **Tech Stack**: React, ethers.js, Lucide icons.
4.  **Design**: Premium, dark-mode, glassmorphism.

**IMPORTANT**: Return ONLY valid JSON. Format:
{
  "/App.js": { "content": "...", "language": "javascript" },
  "/styles.css": { "content": "...", "language": "css" },
  ...
}`;

            const designerResult = await this.model.generateContent({
                contents: [{ role: 'user', parts: [{ text: designerPrompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            });

            const vfsJson = this.cleanJSON(designerResult.response.text());

            // Track token usage
            const designerUsage = designerResult.response.usageMetadata;
            if (designerUsage) {
                totalInputTokens += designerUsage.promptTokenCount || 0;
                totalOutputTokens += designerUsage.candidatesTokenCount || 0;
            }

            messages.push({
                role: 'designer',
                content: 'Project scaffolding complete.',
                timestamp: Date.now(),
            });

            return {
                success: true,
                messages,
                contract: {
                    code: solidityCode,
                },
                files: vfsJson,
                tokenUsage: {
                    inputTokens: totalInputTokens,
                    outputTokens: totalOutputTokens,
                    totalTokens: totalInputTokens + totalOutputTokens,
                },
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                messages,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            };
        }
    }
}

export const orchestrator = new AgentOrchestrator();
