# Genesis - AI-Powered Smart Contract Generator

> **🏆 Hackathon Submission:** NullShot Hacks S0 & DoraHacks BUIDL  
> **🤖 AI Agent + MCP Server** for Web3 Development

An AI-powered platform that transforms natural language into production-ready decentralized applications. Built on the NullShot framework with integrated MCP (Model Context Protocol) servers, Genesis leverages Google Gemini 2.0 Flash to provide intelligent Web3 development assistance.

---

## 🎯 For Judges: Testing Options

**Genesis offers TWO ways to test - choose what works best for you:**

### Option 1: Test Backend Only (Recommended - No Limits!)

Test the AI Agent and MCP Server directly via API using **your own Google API key** (no rate limits!):

```bash
# 1. Clone and navigate
git clone https://github.com/henrysammarfo/Genesis.git
cd Genesis/genesis-nullshot-worker

# 2. Install dependencies
npm install

# 3. Add YOUR Google API key (get free key at https://aistudio.google.com/apikey)
echo "GOOGLE_API_KEY=your_api_key_here" > .dev.vars

# 4. Start server
npm run dev
# Server runs at http://localhost:8787

# 5. Test in another terminal
curl http://localhost:8787/health
# Returns: {"status":"healthy"}
```

**Why this option?**
- ✅ Use YOUR own API key - no rate limits
- ✅ Test AI Agent with real Gemini 2.0 Flash
- ✅ Test MCP Server security analysis
- ✅ No deployment needed
- ✅ Full control

### Option 2: Test Full Stack (Frontend + Backend)

> **⚠️ Note:** The deployed version uses our free-tier API key which has rate limits. For unlimited testing, use Option 1 with your own API key!

**Live Demo:** [Your deployed URL here]

**OR run locally with full UI:**

```bash
# 1. Clone repository
git clone https://github.com/henrysammarfo/Genesis.git
cd Genesis

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Copy .env.local.example to .env.local and add your keys:
GEMINI_API_KEY=your_google_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# ... (see .env.local for all variables)

# 4. Start frontend
npm run dev
# Open http://localhost:3000

# 5. In another terminal, start backend
cd genesis-nullshot-worker
npm run dev
```

**What you can test:**
- ✅ Full dashboard UI
- ✅ Project management
- ✅ AI chat interface
- ✅ Real-time code generation
- ✅ Security analysis
- ✅ Complete user experience

---

## ⚡ Quick Backend Testing Examples

### Test AI Agent
```bash
curl -X POST http://localhost:8787/agent/chat/test-session `
  -H "Content-Type: application/json" `
  -d '{"messages": [{"role": "user", "content": "Explain ERC20 tokens and show me a secure implementation"}]}'
```

**Response:** Real-time streaming from Gemini 2.0 Flash with code examples!

### Test MCP Security Analysis
```bash
curl -X POST http://localhost:8787/mcp `
  -H "Content-Type: application/json" `
  -d '{
    "method": "tools/call",
    "params": {
      "name": "analyze_security",
      "arguments": {
        "source_code": "pragma solidity ^0.8.0;\ncontract Vault {\n  mapping(address => uint256) public balances;\n  function withdraw(uint256 amount) public {\n    require(balances[msg.sender] >= amount);\n    (bool success,) = msg.sender.call{value: amount}(\"\");\n    balances[msg.sender] -= amount;\n  }\n}"
      }
    }
  }'
```

**Response:** Identifies reentrancy vulnerability with recommendations!

### List MCP Tools
```bash
curl -X POST http://localhost:8787/mcp `
  -H "Content-Type: application/json" `
  -d '{"method": "tools/list"}'
```

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
- 🎨 **Modern UI** - Next.js 16 + React 19 dashboard

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│         Frontend (Next.js)                      │
│    • Dashboard UI                               │
│    • Project Management                         │
│    • Real-time Chat                             │
└─────────────────┬───────────────────────────────┘
                  │
                  │ HTTP/WebSocket
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
                  │
                  │
┌─────────────────▼───────────────────────────────┐
│         Supabase (Database)                     │
│    • User authentication                        │
│    • Project storage                            │
│    • Message history                            │
└─────────────────────────────────────────────────┘
```

---

## ✨ Features

### Genesis AI Agent
- **Conversational Interface** - Chat with AI about Web3 development
- **Powered by Gemini 2.0 Flash** - Advanced reasoning and code generation
- **Session-based** - Persistent conversations via Durable Objects
- **Streaming Responses** - Real-time text streaming
- **Multi-turn Conversations** - Context-aware follow-ups

### Genesis MCP Server  
- **Security Analysis** - Scans smart contracts for vulnerabilities
  - Reentrancy detection
  - Access control verification
  - Unsafe external calls
  - tx.origin usage
- **Source Verification** - Generates Etherscan verification URLs
- **Contract Deployment** - Deployment guidance for Sepolia testnet
- **MCP Protocol** - Compatible with any MCP client

### Frontend Dashboard
- **Project Management** - Create and organize dApp projects
- **Real-time Chat** - Interactive AI conversation interface
- **Code Preview** - View generated smart contracts
- **User Authentication** - Secure Supabase auth
- **Credit System** - Track API usage

---

## 🛠️ Technology Stack

**Backend:**
- **AI Model:** Google Gemini 2.0 Flash Experimental
- **Framework:** NullShot (Cloudflare Durable Objects)
- **Protocol:** Model Context Protocol (MCP)
- **Runtime:** Cloudflare Workers
- **Language:** TypeScript
- **Web Framework:** Hono

**Frontend:**
- **Framework:** Next.js 16
- **UI Library:** React 19
- **Styling:** TailwindCSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth

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
├── src/                      # Frontend (Next.js)
│   ├── app/                  # App router
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── api/              # API routes
│   │   └── auth/             # Auth pages
│   ├── components/           # React components
│   └── lib/                  # Utilities
├── supabase/                 # Database migrations
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Google AI API key (get free at https://aistudio.google.com/apikey)
- Supabase account (optional, for frontend)

### Backend Only (Recommended for Testing)

```bash
# 1. Clone repository
git clone https://github.com/henrysammarfo/Genesis.git
cd Genesis/genesis-nullshot-worker

# 2. Install dependencies
npm install

# 3. Create .dev.vars file with your API key
echo "GOOGLE_API_KEY=your_api_key_here" > .dev.vars

# 4. Start development server
npm run dev
# Server runs at http://localhost:8787
```

### Full Stack (Frontend + Backend)

```bash
# 1. Clone repository
git clone https://github.com/henrysammarfo/Genesis.git
cd Genesis

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env.local with:
GEMINI_API_KEY=your_google_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
TAVILY_API_KEY=your_tavily_key
DEPLOYER_PRIVATE_KEY=your_ethereum_private_key
ENCRYPTION_KEY=your_encryption_key

# 4. Run database migrations (in Supabase SQL Editor)
# Execute: supabase/migrations/000_complete_schema.sql

# 5. Start frontend
npm run dev
# Open http://localhost:3000

# 6. In another terminal, start backend
cd genesis-nullshot-worker
npm run dev
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
- Checks for: reentrancy, unsafe calls, tx.origin usage, missing guards

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
      {"role": "user", "content": "Explain the difference between ERC20 and ERC721 with code examples"}
    ]
  }'
```

**Result:** Streaming AI response explaining token standards with Solidity code

---

## ⚠️ Important Notes

### API Rate Limits
- **Deployed version:** Uses our free-tier Google API key (limited requests)
- **Local testing:** Use YOUR own API key for unlimited testing!
- **Get free API key:** https://aistudio.google.com/apikey

### For Judges
- ✅ **Recommended:** Test backend locally with your own API key (Option 1)
- ✅ **Alternative:** Test full stack locally or use deployed version (Option 2)
- ✅ **No limits:** When using your own Google API key
- ⚠️ **Rate limits:** Only apply to our deployed demo

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
- ✅ Frontend dashboard
- ✅ User authentication
- ✅ Project management
- 🔄 Additional MCP tools (web search, document processing)
- 🔄 Multi-chain support
- 🔄 Advanced code generation
- 🔄 Automated testing

---

## 🔒 Security

- API keys stored as Cloudflare secrets
- Input sanitization and validation
- Rate limiting on endpoints
- Automated security scanning of generated contracts
- Supabase RLS policies
- Encrypted user credentials

---

## 🏆 Why Genesis?

**For Developers:**
- Test AI-powered Web3 assistance via simple API calls
- Get instant security analysis of smart contracts
- Learn best practices from AI-generated code
- Use your own API key for unlimited testing

**For Judges:**
- ✅ Easy to test locally - just `npm run dev`
- ✅ Use your own API key - no rate limits
- ✅ Test backend OR full stack
- ✅ Clear API documentation
- ✅ Real functionality - no mocks!

**For the Ecosystem:**
- Democratizes Web3 development through AI
- Promotes security best practices
- MCP protocol enables interoperability
- Open source and extensible

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
- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Database and auth
- [Hono](https://hono.dev/) - Web framework

---

**Made with ❤️ by the Genesis Team**

> **Note for Judges:** For the best testing experience with no rate limits, use Option 1 (backend testing) with your own Google API key. The backend is fully functional and demonstrates all core features. Frontend is available for full UI experience!
