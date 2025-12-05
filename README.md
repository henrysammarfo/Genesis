# Genesis - AI-Powered Smart Contract Generator

> **🏆 Hackathon Submission:** NullShot Hacks S0 & DoraHacks BUIDL  
> **🤖 AI Agent + MCP Server** for Web3 Development

An AI-powered platform that transforms natural language into production-ready decentralized applications. Built on the NullShot framework with integrated MCP (Model Context Protocol) servers, Genesis leverages Google Gemini 2.0 Flash to provide intelligent Web3 development assistance.

---

## 🎯 For Judges: Testing Without Frontend

**The Genesis backend (AI Agent + MCP Server) is fully functional and can be tested via API - no frontend required!**

### Option 1: Test Locally (Recommended - No Deployment Needed)

```bash
# 1. Navigate to worker directory
cd genesis-nullshot-worker

# 2. Install dependencies (if not already done)
npm install

# 3. Start local development server
npm run dev
# Server runs at http://localhost:8787
```

**Test the local server:**
```bash
# Health check
curl http://localhost:8787/health
# Returns: {"status":"healthy"}

# List MCP tools
curl -X POST http://localhost:8787/mcp `
  -H "Content-Type: application/json" `
  -d '{"method": "tools/list"}'

# Test AI Agent
curl -X POST http://localhost:8787/agent/chat/test-session `
  -H "Content-Type: application/json" `
  -d '{"messages": [{"role": "user", "content": "Explain ERC20 tokens"}]}'
```

### Option 2: Test Deployed Worker (If Available)

If the worker is deployed to Cloudflare, find the URL:
```bash
cd genesis-nullshot-worker
npx wrangler deployments list
# Look for: https://genesis-ai.<account>.workers.dev
```

Replace `localhost:8787` with the deployed URL in the commands above.

---

## 🌟 Overview

Genesis democratizes Web3 development through AI-powered code generation and analysis.

### Key Highlights
- 🤖 **AI-Powered Agent** - Google Gemini 2.0 Flash for intelligent assistance
- 🔌 **MCP Server** - Model Context Protocol for tool interoperability  
- 🔒 **Security Analysis** - Automated vulnerability scanning
- 📝 **Smart Contract Generation** - Production-ready Solidity code
- ⚡ **Real-time Streaming** - Live responses via Server-Sent Events
- 🏗️ **NullShot Framework** - Built on Cloudflare Durable Objects

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│         Client (HTTP/MCP Protocol)              │
│    • curl / HTTP requests                       │
│    • MCP Inspector                              │
│    • Any MCP-compatible client                  │
└─────────────────┬───────────────────────────────┘
                  │
                  │ HTTP/HTTPS
                  │
┌─────────────────▼───────────────────────────────┐
│      Genesis Worker (Cloudflare)                │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  Genesis AI Agent                          │ │
│  │  (Durable Object)                          │ │
│  │  • Google Gemini 2.0 Flash                 │ │
│  │  • Session management                      │ │
│  │  • Streaming responses                     │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  MCP Server                                │ │
│  │  • analyze_security                        │ │
│  │  • verify_source                           │ │
│  │  • deploy_contract                         │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

---

## ✨ Features

### Genesis AI Agent
- **Conversational Interface** - Chat with AI about Web3 development
- **Powered by Gemini 2.0 Flash** - Advanced reasoning and code generation
- **Session-based** - Persistent conversations via Durable Objects
- **Streaming Responses** - Real-time text streaming

### Genesis MCP Server  
- **Security Analysis** - Scans smart contracts for vulnerabilities
- **Source Verification** - Generates Etherscan verification URLs
- **Contract Deployment** - Deployment guidance for Sepolia testnet
- **MCP Protocol** - Compatible with any MCP client

---

## 🛠️ Technology Stack

- **AI Model:** Google Gemini 2.0 Flash Experimental
- **Framework:** NullShot (Cloudflare Durable Objects)
- **Protocol:** Model Context Protocol (MCP)
- **Runtime:** Cloudflare Workers
- **Language:** TypeScript
- **Web Framework:** Hono

---

## 📁 Project Structure

```
Genesis/
├── genesis-nullshot-worker/   # Cloudflare Worker (Backend)
│   ├── src/
│   │   ├── index.ts          # Main worker entry point
│   │   ├── mcp/              # MCP server implementation
│   │   │   ├── handlers.ts   # Tool handlers
│   │   │   └── schemas.ts    # Tool schemas
│   │   └── ...
│   ├── wrangler.jsonc        # Cloudflare config
│   └── package.json
├── src/                      # Frontend (Next.js - in progress)
├── supabase/                 # Database migrations
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Google AI API key (for Gemini)

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/henrysammarfo/Genesis.git
cd Genesis/genesis-nullshot-worker

# 2. Install dependencies
npm install

# 3. Set up environment (create .dev.vars file)
echo "GOOGLE_API_KEY=your_api_key_here" > .dev.vars

# 4. Start development server
npm run dev
# Server runs at http://localhost:8787
```

### Deployment to Cloudflare

```bash
# Set secrets
npx wrangler secret put GOOGLE_API_KEY

# Deploy
npx wrangler deploy
```

---

## 📡 API Reference

### Health Check
```bash
GET /health
```
Returns: `{"status":"healthy"}`

### AI Agent Chat
```bash
POST /agent/chat/:sessionId
Content-Type: application/json

{
  "messages": [
    {"role": "user", "content": "Create an ERC20 token"}
  ]
}
```

Returns: Streaming text response with AI-generated code and explanations

### MCP Server - List Tools
```bash
POST /mcp
Content-Type: application/json

{
  "method": "tools/list"
}
```

Returns: List of available MCP tools

### MCP Server - Call Tool
```bash
POST /mcp
Content-Type: application/json

{
  "method": "tools/call",
  "params": {
    "name": "analyze_security",
    "arguments": {
      "source_code": "pragma solidity ^0.8.0; contract Token { ... }"
    }
  }
}
```

Returns: Tool execution result

---

## 🔧 Available MCP Tools

### 1. `analyze_security`
Analyzes smart contract code for security vulnerabilities.

**Input:**
- `source_code` (string): Solidity source code

**Output:**
- Security analysis with identified issues and recommendations

### 2. `verify_source`
Generates Etherscan verification URL for a contract.

**Input:**
- `address` (string): Contract address
- `network` (string): Network name (e.g., "sepolia")

**Output:**
- `verification_url`: Etherscan verification URL

### 3. `deploy_contract`
Provides deployment guidance for smart contracts.

**Input:**
- `source_code` (string): Solidity source code

**Output:**
- Deployment instructions and guidance

---

## 💡 Example Usage

### Example 1: Security Analysis

```bash
curl -X POST http://localhost:8787/mcp `
  -H "Content-Type: application/json" `
  -d '{
    "method": "tools/call",
    "params": {
      "name": "analyze_security",
      "arguments": {
        "source_code": "pragma solidity ^0.8.0;\n\ncontract Vault {\n    mapping(address => uint256) public balances;\n    \n    function withdraw(uint256 amount) public {\n        require(balances[msg.sender] >= amount);\n        (bool success,) = msg.sender.call{value: amount}(\"\");\n        require(success);\n        balances[msg.sender] -= amount;\n    }\n}"
      }
    }
  }'
```

**Result:** Identifies reentrancy vulnerability (external call before state update)

### Example 2: AI Agent Conversation

```bash
curl -X POST http://localhost:8787/agent/chat/my-session `
  -H "Content-Type: application/json" `
  -d '{
    "messages": [
      {"role": "user", "content": "Explain the difference between ERC20 and ERC721"}
    ]
  }'
```

**Result:** Streaming AI response explaining token standards

---

## 🎯 NullShot Framework Integration

Genesis is built on the NullShot framework, leveraging:

1. **Durable Objects** - Stateful, low-latency edge computing
2. **Session Persistence** - Conversations persist across requests
3. **Scalability** - Automatic distribution across Cloudflare's network
4. **MCP Protocol** - Interoperable tools for AI agents

---

## 📈 Roadmap

- ✅ AI Agent with Gemini 2.0 Flash
- ✅ MCP server implementation
- ✅ Security analysis tool
- ✅ Source verification tool
- ✅ Streaming responses
- 🔄 Frontend deployment
- 🔄 Additional MCP tools (web search, document processing)
- 🔄 Multi-chain support
- 🔄 Advanced code generation

---

## 🔒 Security

- API keys stored as Cloudflare secrets
- Input sanitization and validation
- Rate limiting on endpoints
- Automated security scanning of generated contracts

---

## 🏆 Why Genesis?

**For Developers:**
- Test AI-powered Web3 assistance via simple API calls
- Get instant security analysis of smart contracts
- Learn best practices from AI-generated code

**For Judges:**
- ✅ Easy to test locally - just `npm run dev`
- ✅ No complex setup required
- ✅ Clear API documentation
- ✅ Works without frontend deployment

**For the Ecosystem:**
- Democratizes Web3 development through AI
- Promotes security best practices
- MCP protocol enables interoperability

---

## 📝 License

MIT License - See LICENSE file for details.

---

## 📞 Support & Links

- **GitHub:** [https://github.com/henrysammarfo/Genesis](https://github.com/henrysammarfo/Genesis)
- **Documentation:** [DOCUMENTATION.md](./DOCUMENTATION.md)
- **Issues:** [GitHub Issues](https://github.com/henrysammarfo/Genesis/issues)

---

## 🙏 Acknowledgments

Built for **NullShot Hacks S0** and **DoraHacks BUIDL** programs.

**Technologies:**
- [NullShot Framework](https://nullshot.ai) - Agent orchestration
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI model
- [Cloudflare Workers](https://workers.cloudflare.com/) - Edge computing
- [Model Context Protocol](https://modelcontextprotocol.io/) - Tool interoperability
- [Hono](https://hono.dev/) - Web framework

---

**Made with ❤️ by the Genesis Team**

> **Note for Judges:** The backend is fully functional and can be tested locally with `npm run dev` in the `genesis-nullshot-worker` directory. No frontend or cloud deployment required for testing core functionality!
