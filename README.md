# Genesis - AI-Powered Smart Contract Factory

> **Built for NullShot Hacks S0** | AI Agent + MCP Submission

Genesis is an AI-powered dApp factory that transforms natural language into production-ready smart contracts. Built 100% on the **NullShot framework**, Genesis uses stateful Durable Objects and multi-agent orchestration to architect, secure, and deploy Ethereum contracts in seconds.

## 🎯 What Genesis Does

**Input**: "Build me a token with 1M supply and 18 decimals"  
**Output**: Deployed ERC-20 contract on Sepolia testnet

Genesis eliminates the complexity of blockchain development by:
1. **Understanding** your requirements through natural language
2. **Architecting** optimal smart contract solutions
3. **Generating** secure, audited Solidity code
4. **Deploying** to Ethereum Sepolia testnet
5. **Verifying** contracts on block explorers

## 🏗️ Architecture

### NullShot Framework Integration (100%)

Genesis is built entirely on NullShot's infrastructure:

- **Cloudflare Workers**: Serverless execution environment
- **Durable Objects**: Stateful AI agent sessions (`GenesisAgent`)
- **AI SDK v5**: Streaming responses with Gemini 2.0 Flash
- **MCP Server**: Exposes deployment tools to other agents

### Multi-Agent System

Three specialized AI agents collaborate on every contract:

1. **Architect Agent**: Analyzes requirements, designs contract structure
2. **Engineer Agent**: Writes Solidity code, implements features
3. **Deployer Agent**: Compiles, tests, and deploys to blockchain

### Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Authentication**: Supabase Auth (Google/GitHub OAuth)
- **AI**: Google Gemini 2.0 Flash (multi-agent orchestration)
- **Blockchain**: Ethers.js v6 (Ethereum Sepolia)
- **Compiler**: solc (Solidity 0.8.x)
- **Worker**: Cloudflare Workers + Durable Objects (NullShot)
- **Tools**: Tavily Search API, PDF/TXT document reading

## 🚀 Features

### ✅ Currently Implemented

- **Natural Language Interface**: Describe dApps in plain English
- **Multi-Agent Orchestration**: Architect-Engineer-Deployer collaboration
- **Ethereum Deployment**: Sepolia testnet with Ethers.js
- **Credit System**: Dynamic pricing with usage tracking
- **Secure Compilation**: Solidity compiler with OpenZeppelin support
- **User Wallet Management**: Encrypted private key storage
- **AI-Powered Tools**: Web search (Tavily), document reading
- **NullShot Worker**: Stateful Durable Object agents

### 🔜 Coming Next (Phase 7)

- **Genesis MCP Server**: Tools for cross-agent deployment
  - `deploy_contract(chain, source_code, args)`
  - `verify_source(chain, address)`
  - `analyze_security(source_code)`
- **Mainnet Support**: Production deployments
- **Advanced Security**: Formal verification integration

## 🔌 Genesis MCP Server

Genesis exposes an MCP (Model Context Protocol) server that allows other AI agents to deploy smart contracts.

### Available Tools

#### 1. `analyze_security`
Analyze Solidity code for security vulnerabilities using AI.

**Input:**
```json
{
  "source_code": "pragma solidity ^0.8.0; contract Token { ... }"
}
```

**Output:**
```json
{
  "success": true,
  "issues": [
    {
      "severity": "high",
      "title": "Reentrancy vulnerability",
      "description": "Function transfers value before state update",
      "line": 42
    }
  ],
  "score": 75
}
```

#### 2. `verify_source`
Get Etherscan verification URL for a deployed contract.

**Input:**
```json
{
  "address": "0x1234...",
  "source_code": "pragma solidity ^0.8.0; ...",
  "contract_name": "MyToken",
  "compiler_version": "v0.8.20+commit.a1b79de6"
}
```

**Output:**
```json
{
  "success": true,
  "verification_url": "https://sepolia.etherscan.io/address/0x1234..."
}
```

#### 3. `deploy_contract`
Deploy a smart contract to Ethereum Sepolia.

**Input:**
```json
{
  "source_code": "pragma solidity ^0.8.0; ...",
  "contract_name": "MyToken",
  "constructor_args": [1000000, "MyToken", "MTK"]
}
```

**Output:**
```json
{
  "success": true,
  "address": "0x5678...",
  "transaction_hash": "0xabcd..."
}
```

### Using the MCP Server

The Genesis MCP server runs as part of the Cloudflare Worker. To use it:

1. **Deploy the worker:**
```bash
cd genesis-nullshot-worker
wrangler deploy
```

2. **Configure MCP client:**
```json
{
  "mcpServers": {
    "genesis": {
      "url": "https://your-worker.workers.dev/mcp"
    }
  }
}
```

3. **Call tools from your agent:**
```typescript
const result = await mcp.callTool('analyze_security', {
  source_code: contractCode
});
```


## 📦 Installation

### Prerequisites

- Node.js 18+
- Supabase account
- Google AI API key
- Tavily API key (optional)
- Ethereum wallet with Sepolia ETH

### Quick Start

1. **Clone and install**
```bash
git clone <repository-url>
cd azimuthal-perseverance
npm install
```

2. **Configure environment**

Create `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google AI
GOOGLE_AI_API_KEY=your_gemini_api_key

# Tavily (optional)
TAVILY_API_KEY=your_tavily_key
```

3. **Set up database**

Run SQL migrations in `supabase/migrations/`:
- `users` table
- `credits` table  
- `transactions` table
- `user_env_vars` table (encrypted storage)

4. **Deploy NullShot Worker**
```bash
cd genesis-nullshot-worker
npm install
wrangler deploy
```

5. **Run development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

1. **Sign in** with Google/GitHub
2. **Configure wallet** in Settings (add Sepolia private key)
3. **Describe your dApp** in natural language
4. **Review** AI-generated architecture and code
5. **Deploy** to Sepolia testnet
6. **Verify** on Etherscan

## 🧪 Testing

```bash
# Test AI agent orchestration
npm run test:agent

# Test contract deployment
npm run test:deploy

# Test full system
npm run test:system
```

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js pages
│   │   ├── auth/         # Authentication
│   │   ├── dashboard/    # Main app
│   │   └── api/          # API routes
│   ├── components/       # React components
│   ├── lib/
│   │   ├── agents/       # Multi-agent orchestration
│   │   ├── deployer/     # Ethereum deployment
│   │   ├── supabase/     # Database client
│   │   └── tools/        # AI tools (search, docs)
├── genesis-nullshot-worker/  # NullShot Durable Object
│   ├── src/index.ts      # GenesisAgent implementation
│   └── wrangler.jsonc    # Cloudflare config
└── scripts/              # Test utilities
```

## 🏆 NullShot Hacks S0 Submission

### Track Submissions

**1. AI Agent Track**
- Multi-agent system using NullShot Durable Objects
- Stateful sessions with conversation history
- Gemini 2.0 Flash integration via AI SDK v5

**2. MCP Track** (Phase 7)
- Genesis MCP Server for cross-agent deployment
- Tools: `deploy_contract`, `verify_source`, `analyze_security`
- Enables any agent to deploy smart contracts

### Impact & Use Cases

**For Developers:**
- Build dApps 10x faster with AI assistance
- No Solidity expertise required
- Automated security best practices

**For NullShot Ecosystem:**
- Demonstrates Durable Objects for stateful agents
- Provides on-chain deployment capabilities
- Attracts Web3 developers to NullShot

**Use Cases:**
- **DeFi**: Deploy custom token contracts
- **NFTs**: Generate collection contracts
- **DAOs**: Create governance contracts
- **Gaming**: Build in-game asset contracts

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **NullShot Framework**: [GitHub](https://github.com/edenlabllc/nullshot)
- **Documentation**: See `/docs` folder

## 📄 License

MIT License

## 🤝 Contributing

Contributions welcome! Please open an issue first.

---

**Built with ❤️ for NullShot Hacks S0**  
*Democratizing blockchain development through AI*
