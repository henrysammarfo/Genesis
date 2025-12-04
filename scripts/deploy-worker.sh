#!/bin/bash
# Genesis - Cloudflare Worker Deployment Script

set -e

echo "🚀 Genesis - Deploying NullShot Worker to Cloudflare"
echo "=================================================="

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Navigate to worker directory
cd genesis-nullshot-worker

# Check if logged in
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "⚠️  Not logged in. Please authenticate:"
    wrangler login
fi

# Install dependencies
echo "📦 Installing worker dependencies..."
npm install

# Set secrets
echo "🔑 Setting up secrets..."
echo "Please enter your GOOGLE_API_KEY (Gemini API Key):"
wrangler secret put GOOGLE_API_KEY

# Deploy worker
echo "🚀 Deploying worker..."
wrangler deploy

# Get worker URL
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Your worker is now live!"
echo "2. Test the MCP endpoint: https://YOUR-WORKER.workers.dev/mcp"
echo "3. Update your .env.local with the worker URL"
echo "4. Run the MCP tests: npm run test:mcp"
echo ""
echo "🔗 Worker URL will be shown above in the deployment output"
