import { Hono } from 'hono';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, CoreMessage } from 'ai';
import { MCPHandlers } from './mcp/handlers';
import { MCP_TOOLS } from './mcp/schemas';

type Env = {
  GOOGLE_API_KEY: string;
  GENESIS_AGENT: DurableObjectNamespace;
};

const app = new Hono<{ Bindings: Env }>();

// NullShot-compatible Durable Object Agent
export class GenesisAgent implements DurableObject {
  state: DurableObjectState;
  env: Env;
  model: any;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;

    // Initialize Gemini model
    const google = createGoogleGenerativeAI({
      apiKey: env.GOOGLE_API_KEY,
    });
    this.model = google('gemini-2.0-flash');
  }

  async fetch(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);

      // Handle chat endpoint
      if (url.pathname.includes('/chat') && request.method === 'POST') {
        const body = await request.json() as { messages: CoreMessage[] };
        const { messages } = body;

        if (!messages) {
          return new Response('Missing messages in body', { status: 400 });
        }

        const result = await streamText({
          model: this.model,
          messages: messages,
          system: `You are a helpful AI assistant for the Genesis platform. 
  You help users build decentralized applications (dApps) by providing expert guidance on:
  - Blockchain development
  - Smart contracts  
  - Web3 architecture
  - Solidity programming
  - DeFi protocols

  Provide comprehensive, accurate responses to help users succeed in their dApp development.`,
          maxSteps: 10,
        });

        return result.toTextStreamResponse();
      }

      return new Response('Genesis AI Agent - Use POST /chat', { status: 200 });
    } catch (error: any) {
      console.error('Worker Error:', error);
      return new Response(`Worker Error: ${error.message}\nStack: ${error.stack}`, { status: 500 });
    }
  }
}

// Router for agent sessions
app.post('/agent/chat/:sessionId', async (c) => {
  const sessionId = c.req.param('sessionId');
  const id = c.env.GENESIS_AGENT.idFromName(sessionId);
  const stub = c.env.GENESIS_AGENT.get(id);
  return stub.fetch(c.req.raw);
});

app.get('/', (c) => {
  return c.text('Genesis AI - NullShot Compatible Agent');
});

app.get('/health', (c) => {
  return c.json({ status: 'healthy' });
});

// MCP Tool Handler
app.post('/mcp', async (c) => {
  try {
    const body = await c.req.json();
    const { method, params } = body;

    // Initialize handlers
    // In a real deployment, you'd get the private key from env
    const handlers = new MCPHandlers(
      new GenesisAgent(c.env.GENESIS_AGENT as any, c.env).model,
      undefined
    );

    if (method === 'tools/list') {
      return c.json({
        tools: Object.values(MCP_TOOLS)
      });
    }

    if (method === 'tools/call') {
      const { name, arguments: args } = params;

      switch (name) {
        case 'deploy_contract':
          return c.json(await handlers.deployContract(args));
        case 'verify_source':
          return c.json(await handlers.verifySource(args));
        case 'analyze_security':
          return c.json(await handlers.analyzeSecurity(args));
        default:
          return c.json({ error: 'Tool not found' }, 404);
      }
    }

    return c.json({ error: 'Method not supported' }, 400);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default {
  fetch: app.fetch,
};
