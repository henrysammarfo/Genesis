# Genesis - AI-Powered Smart Contract Generator

> **🏆 Hackathon Submission:** NullShot Hacks S0 & DoraHacks BUIDL  
> **🤖 AI Agent + MCP Server** for Web3 Development

An AI-powered platform that transforms natural language into production-ready decentralized applications. Built on the NullShot framework with integrated MCP (Model Context Protocol) servers, Genesis leverages multiple specialized AI agents to handle every aspect of dApp development.

---

## 🎯 For Judges: Quick Testing Guide

### Testing the MCP Server (Deployed & Ready)

The Genesis MCP Server is **deployed and functional**. Test it directly:

**MCP Endpoint:** `https://genesis-ai.workers.dev/mcp` *(replace with your actual URL)*

#### Option 1: Using MCP Inspector
```bash
npx @modelcontextprotocol/inspector https://genesis-ai.workers.dev/mcp
```

#### Option 2: Direct HTTP Calls
```bash
# List available tools
curl https://genesis-ai.workers.dev/mcp/tools

# Test security analysis
curl -X POST https://genesis-ai.workers.dev/mcp/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "analyze_security",
    "arguments": {
      "source_code": "pragma solidity ^0.8.0; contract Token { mapping(address => uint256) public balances; function transfer(address to, uint256 amount) public { balances[msg.sender] -= amount; balances[to] += amount; } }"
    }
  }'

# Test web search
curl -X POST https://genesis-ai.workers.dev/mcp/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "web_search",
    "arguments": {
      "query": "ERC20 best practices 2024"
    }
  }'
```

### Testing the AI Agent (Backend API)

The AI Agent runs on Cloudflare Durable Objects and can be tested via API:

**Agent Endpoint:** `https://genesis-ai.workers.dev/agent`

#### Start a Conversation
```bash
# Create a new session and send a message
curl -X POST https://genesis-ai.workers.dev/agent/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Create an ERC20 token with 1 million supply and transfer fees",
    "sessionId": "test-session-123"
  }'
```

#### Stream Responses (WebSocket)
```javascript
// Connect to WebSocket for real-time streaming
const ws = new WebSocket('wss://genesis-ai.workers.dev/agent/stream?sessionId=test-session-123');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Agent response:', data);
};

ws.send(JSON.stringify({
  message: "Add a staking mechanism to the token"
}));
```

---

## 🌟 Overview

Genesis is a revolutionary platform that democratizes Web3 development through AI. No frontend deployment is required to test the core functionality - both the AI Agent and MCP Server are accessible via API.

### Key Highlights
- 🤖 **Multi-Agent AI System** - Specialized agents for architecture, engineering, security, and optimization
- 🔌 **MCP Server Integration** - Model Context Protocol for tool interoperability
- ⚡ **Real-time Streaming** - Live updates as code is generated via WebSocket
- 🔒 **Security Analysis** - Automated vulnerability scanning
- 🚀 **Auto-deployment** - Deploy directly to Sepolia testnet
- 📄 **Document Processing** - Upload PDFs for context
- 🔍 **Web Search** - AI searches for latest documentation

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│         Client (API/WebSocket/MCP)              │
│    • HTTP Requests                              │
│    • WebSocket Streaming                        │
│    • MCP Protocol Calls                         │
└─────────────────┬───────────────────────────────┘
                  │
                  │ HTTPS/WSS
                  │
┌─────────────────▼───────────────────────────────┐
│         Genesis AI Agent System                  │
│      (Cloudflare Durable Objects)               │
│                                                  │
│  • Architect Agent - System Design              │
│  • Engineer Agent - Code Generation             │
│  • Security Agent - Vulnerability Analysis      │
│  • Optimizer Agent - Gas Optimization           │
│  • Gemini 2.0 Flash Integration                 │
│  • NullShot Framework                           │
└─────────────────┬───────────────────────────────┘
                  │
                  │ MCP Protocol
                  │
┌─────────────────▼───────────────────────────────┐
│            Genesis MCP Server                    │
│      (Cloudflare Durable Objects)               │
│                                                  │
│  Tools:                                         │
│  • analyze_security - Security scanning         │
│  • verify_source - Etherscan verification       │
│  • deploy_contract - Smart contract deployment  │
│  • web_search - Documentation research          │
│  • process_document - PDF/TXT analysis          │
│                                                  │
│  Integrations:                                  │
│  • Tavily API (Web Research)                    │
│  • Ethers.js (Blockchain Interaction)           │
│  • Supabase (Data Persistence)                  │
└─────────────────────────────────────────────────┘
```

---

## ✨ Features

### Genesis AI Agents
- **Real-time conversational interface** for dApp development
- **Powered by Google Gemini 2.0 Flash** for advanced reasoning
- **Session-based project management** via Durable Objects
- **Automatic tool invocation** for security analysis and deployment
- **WebSocket and SSE support** for streaming responses
- **Multi-agent collaboration** with specialized roles

### Genesis MCP Server
- **Security Analysis**: Comprehensive smart contract vulnerability scanning
  - Reentrancy detection
  - Access control verification
  - Integer overflow/underflow checks
  - Gas optimization recommendations
  
- **Source Verification**: Automated Etherscan verification URL generation
  - Multi-network support (Sepolia, Mainnet)
  - Automatic constructor argument encoding
  
- **Contract Deployment**: Guided deployment to Sepolia testnet
  - Transaction tracking
  - Gas estimation
  - Deployment status monitoring
  
- **Web Research**: Integrated search for latest Web3 documentation
  - Powered by Tavily API
  - Returns code examples and best practices
  
- **Document Processing**: Extract requirements from uploaded PDFs/TXT files
  - Context extraction for AI agents
  - Requirement analysis

### Complete Project Generation
- **Smart Contracts**: Solidity contracts with security best practices
- **Frontend**: React/Next.js with Web3 integration (code generation)
- **Backend APIs**: RESTful endpoints and WebSocket handlers
- **Configuration**: Environment setup and deployment scripts
- **Documentation**: Comprehensive README and API docs

---

## 🛠️ Technology Stack

### Genesis AI Agent
- **Framework**: NullShot Framework for agent orchestration
- **AI Model**: Google Gemini 2.0 Flash Experimental
- **Runtime**: Cloudflare Durable Objects
- **Real-time**: WebSocket and Server-Sent Events
- **Language**: TypeScript

### Genesis MCP Server
- **Protocol**: Model Context Protocol (MCP)
- **Runtime**: Cloudflare Durable Objects
- **Database**: Supabase (PostgreSQL)
- **Search**: Tavily API
- **Blockchain**: Ethers.js, Sepolia Testnet
- **Security**: Automated vulnerability scanning

### Frontend (Optional - Not Required for Testing)
- Next.js 16
- React 19
- TailwindCSS
- TypeScript

---

## 📁 Project Structure

```
Genesis/
├── src/
│   ├── app/                    # Next.js app directory (frontend)
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard UI
│   │   └── auth/              # Authentication
│   ├── components/            # React components
│   ├── lib/                   # Utilities
│   └── types/                 # TypeScript types
├── genesis-nullshot-worker/   # Cloudflare Worker (DEPLOYED)
│   ├── src/
│   │   ├── agents/           # AI agent implementations
│   │   │   ├── architect.ts  # Architecture planning
│   │   │   ├── engineer.ts   # Code generation
│   │   │   ├── security.ts   # Security analysis
│   │   │   └── optimizer.ts  # Gas optimization
│   │   ├── mcp/              # MCP server
│   │   │   ├── server.ts     # MCP protocol handler
│   │   │   └── tools/        # Individual MCP tools
│   │   └── index.ts          # Worker entry point
│   └── wrangler.jsonc        # Worker configuration
├── supabase/
│   └── migrations/           # Database schema
├── scripts/                  # Deployment scripts
└── public/                   # Static assets
```

---

## 🚀 Getting Started (For Development)

### Prerequisites
- Node.js 18+
- Supabase account
- Google AI API key
- Tavily API key (for web search)
- Cloudflare account (for worker deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/henrysammarfo/Genesis.git
cd Genesis

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create `.env.local`:

```bash
# Google AI
GEMINI_API_KEY=your_google_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Web Search
TAVILY_API_KEY=your_tavily_key

# Blockchain
DEPLOYER_PRIVATE_KEY=your_ethereum_private_key

# Security
ENCRYPTION_KEY=your_encryption_key

# Worker URL (deployed)
NEXT_PUBLIC_WORKER_URL=https://genesis-ai.workers.dev
```

### Database Setup

1. Go to Supabase SQL Editor
2. Run the migration:
   ```sql
   -- Execute: supabase/migrations/000_complete_schema.sql
   ```

### Worker Deployment (Already Deployed for Judges)

```bash
# Navigate to worker directory
cd genesis-nullshot-worker

# Set secrets
npx wrangler secret put GOOGLE_API_KEY
npx wrangler secret put TAVILY_API_KEY
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_KEY

# Deploy to Cloudflare
npx wrangler deploy
```

---

## 📡 API Reference

### Genesis AI Agent API

#### POST `/agent/chat`
Start or continue a conversation with the AI agent.

**Request:**
```json
{
  "message": "Create an ERC20 token with staking",
  "sessionId": "unique-session-id",
  "projectId": "optional-project-id"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "unique-session-id",
  "response": "I'll help you create an ERC20 token with staking functionality...",
  "agents": ["architect", "engineer", "security"],
  "files": [
    {
      "name": "Token.sol",
      "path": "contracts/Token.sol",
      "content": "pragma solidity ^0.8.0;..."
    }
  ]
}
```

#### WebSocket `/agent/stream`
Stream real-time responses from the AI agent.

**Connection:**
```javascript
const ws = new WebSocket('wss://genesis-ai.workers.dev/agent/stream?sessionId=SESSION_ID');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // data.type: 'thinking' | 'response' | 'file' | 'complete'
  // data.content: The actual content
  // data.agent: Which agent is responding
};
```

### Genesis MCP Server API

#### GET `/mcp/tools`
List all available MCP tools.

**Response:**
```json
{
  "tools": [
    {
      "name": "analyze_security",
      "description": "Analyzes smart contract code for security vulnerabilities",
      "inputSchema": {
        "type": "object",
        "properties": {
          "source_code": {
            "type": "string",
            "description": "Solidity source code to analyze"
          }
        }
      }
    }
  ]
}
```

#### POST `/mcp/call`
Call a specific MCP tool.

**Request:**
```json
{
  "tool": "analyze_security",
  "arguments": {
    "source_code": "pragma solidity ^0.8.0; contract Token { ... }"
  }
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "issues": [
      {
        "severity": "high",
        "title": "Reentrancy vulnerability",
        "description": "The transfer function is vulnerable to reentrancy attacks",
        "line": 15,
        "recommendation": "Use the Checks-Effects-Interactions pattern"
      }
    ],
    "score": 65,
    "summary": "Found 3 high-severity issues, 2 medium, 1 low"
  }
}
```

---

## 🔧 Available MCP Tools

### 1. `analyze_security`
Scans smart contracts for vulnerabilities.

**Input:**
- `source_code` (string): Solidity source code

**Output:**
- `issues` (array): List of security issues with severity, title, description
- `score` (number): Security score 0-100
- `summary` (string): Brief summary of findings

### 2. `verify_source`
Generates Etherscan verification URL.

**Input:**
- `address` (string): Contract address
- `network` (string): Network name (e.g., "sepolia")

**Output:**
- `verification_url` (string): Etherscan verification URL
- `network` (string): Network name

### 3. `deploy_contract`
Deploys contract to Sepolia testnet.

**Input:**
- `source_code` (string): Solidity source code
- `contract_name` (string): Name of contract to deploy
- `constructor_args` (array): Constructor arguments

**Output:**
- `transaction_hash` (string): Deployment transaction hash
- `contract_address` (string): Deployed contract address
- `network` (string): Network name

### 4. `web_search`
Searches for Web3 documentation and examples.

**Input:**
- `query` (string): Search query

**Output:**
- `results` (array): Search results with title, url, snippet
- `summary` (string): AI-generated summary of findings

### 5. `process_document`
Extracts context from uploaded documents.

**Input:**
- `content` (string): Document content (PDF/TXT)
- `type` (string): Document type

**Output:**
- `extracted_text` (string): Extracted text
- `requirements` (array): Identified requirements
- `summary` (string): Document summary

---

## 🌐 Supported Networks

- ✅ Sepolia Testnet (Deployed & Active)
- 🔄 Ethereum Mainnet (Coming Soon)
- 🔄 Polygon (Coming Soon)
- 🔄 Arbitrum (Coming Soon)
- 🔄 Optimism (Coming Soon)
- 🔄 Base (Coming Soon)

---

## 💡 Use Cases & Examples

### Example 1: Generate DeFi Protocol
```bash
curl -X POST https://genesis-ai.workers.dev/agent/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Create a lending protocol with collateralized loans, interest rates, and liquidation mechanism",
    "sessionId": "defi-example"
  }'
```

**Result:** Complete lending protocol with:
- Lending pool contract
- Interest rate model
- Liquidation logic
- Oracle integration
- Security analysis report

### Example 2: Security Analysis
```bash
curl -X POST https://genesis-ai.workers.dev/mcp/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "analyze_security",
    "arguments": {
      "source_code": "pragma solidity ^0.8.0;\n\ncontract Vault {\n    mapping(address => uint256) public balances;\n    \n    function deposit() public payable {\n        balances[msg.sender] += msg.value;\n    }\n    \n    function withdraw(uint256 amount) public {\n        require(balances[msg.sender] >= amount);\n        (bool success,) = msg.sender.call{value: amount}(\"\");\n        require(success);\n        balances[msg.sender] -= amount;\n    }\n}"
    }
  }'
```

**Result:** Identifies reentrancy vulnerability and suggests fix.

### Example 3: Research Best Practices
```bash
curl -X POST https://genesis-ai.workers.dev/mcp/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "web_search",
    "arguments": {
      "query": "OpenZeppelin ERC721 upgradeable pattern 2024"
    }
  }'
```

**Result:** Latest documentation and code examples.

---

## 🎯 NullShot Framework Integration

Genesis is built on the NullShot framework, enabling:

1. **Zero-Shot Learning:** Agents handle new tasks without specific training
2. **Multi-Agent Collaboration:** Seamless coordination between specialized agents
3. **Streaming Responses:** Real-time updates via WebSocket/SSE
4. **Context Awareness:** Persistent conversation history and project context
5. **Tool Integration:** MCP servers and external APIs
6. **Durable Objects:** Stateful, low-latency edge computing

---

## 📈 Roadmap

- ✅ Multi-agent AI system
- ✅ MCP server integration
- ✅ Smart contract generation
- ✅ Security analysis
- ✅ Sepolia deployment
- ✅ WebSocket streaming
- ✅ Document processing
- 🔄 Mainnet deployment support
- 🔄 Multi-chain support (Polygon, Arbitrum, Base)
- 🔄 Advanced testing framework generation
- 🔄 CI/CD pipeline generation
- 🔄 Audit report generation
- 🔄 Frontend deployment (in progress)

---

## 🔒 Security

- All API keys encrypted at rest
- Row-level security (RLS) on database
- Rate limiting on all endpoints
- Input sanitization and validation
- Automated security scanning of generated contracts
- Comprehensive security reports
- No sensitive data in logs

---

## 🏆 Why Genesis?

**For Developers:**
- Accelerate development from weeks to minutes
- Learn best practices from AI-generated code
- Focus on business logic, not boilerplate
- Test via API without frontend setup

**For Entrepreneurs:**
- Validate ideas quickly with working prototypes
- Reduce development costs significantly
- Launch MVPs faster
- No technical expertise required

**For the Ecosystem:**
- Democratize Web3 development
- Increase quality through automated security analysis
- Promote best practices and standards
- Interoperable via MCP protocol

**For Judges:**
- Easy to test via API/MCP
- No deployment required
- Clear documentation
- Real-world use cases

---

## 📝 License

MIT License - See LICENSE file for details.

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

---

## 📞 Support & Links

- **GitHub Repository:** [https://github.com/henrysammarfo/Genesis](https://github.com/henrysammarfo/Genesis)
- **Documentation:** [DOCUMENTATION.md](./DOCUMENTATION.md)
- **Issues:** [GitHub Issues](https://github.com/henrysammarfo/Genesis/issues)
- **Discussions:** [GitHub Discussions](https://github.com/henrysammarfo/Genesis/discussions)

---

## 🙏 Acknowledgments

Built for the **NullShot Hacks S0** and **DoraHacks BUIDL** programs.

**Technologies:**
- [NullShot Framework](https://nullshot.ai) - Agent orchestration
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI model
- [Cloudflare Workers](https://workers.cloudflare.com/) - Edge computing
- [Model Context Protocol](https://modelcontextprotocol.io/) - Tool interoperability
- [Supabase](https://supabase.com/) - Database and auth
- [Ethers.js](https://ethers.org/) - Ethereum library
- [Tavily](https://tavily.com/) - Web search API

---

**Made with ❤️ by the Genesis Team**

> **Note for Judges:** The MCP Server is deployed and ready to test. The AI Agent backend is functional via API. Frontend deployment is in progress but not required for core functionality testing.
