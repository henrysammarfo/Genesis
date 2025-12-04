# Genesis - AI-Powered Smart Contract Generator

## 🚀 Features
- Multi-agent AI system for dApp generation
- Real-time contract generation with streaming
- MCP server integration
- Security analysis
- Auto-deployment to Sepolia
- Credit-based system
- Document upload (PDF/TXT)
- Web search integration

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- Supabase account
- Google AI API key
- Tavily API key (for web search)

### Environment Variables
Create `.env.local`:
```bash
GEMINI_API_KEY=your_google_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
TAVILY_API_KEY=your_tavily_key
DEPLOYER_PRIVATE_KEY=your_ethereum_private_key
ENCRYPTION_KEY=your_encryption_key
```

### Installation
```bash
npm install
npm run dev
```

### Database Setup
1. Go to Supabase SQL Editor
2. Run `supabase/migrations/000_complete_schema.sql`

### Worker Deployment
```bash
cd genesis-nullshot-worker
npx wrangler secret put GOOGLE_API_KEY
npx wrangler deploy
```

## 🧪 Testing
```bash
npm run test:core  # Core features
npm run test:mcp   # MCP server
```

## 📦 Tech Stack
- Next.js 16
- React 19
- Supabase
- Cloudflare Workers
- Google Gemini AI
- Tavily Search
- Ethers.js

## 🔒 Security
- All secrets in `.env.local` (gitignored)
- RLS policies on database
- Encrypted user credentials
- Rate limiting
- Input sanitization

## 📝 License
MIT
