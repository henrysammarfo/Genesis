#!/bin/bash
# Genesis - Complete Live Test Runner
# Ensures dev server is running and runs all tests

echo "🚀 Genesis - Complete Live Test Runner"
echo "======================================"
echo ""

# Check if dev server is running
echo "📡 Checking if dev server is running..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Dev server is running"
else
    echo "❌ Dev server is NOT running"
    echo "Please start it with: npm run dev"
    echo ""
    exit 1
fi

# Load environment variables
if [ -f .env.local ]; then
    echo "✅ Loading environment variables from .env.local"
    export $(cat .env.local | grep -v '^#' | xargs)
else
    echo "⚠️  No .env.local found - some tests may fail"
fi

echo ""
echo "🧪 Running Complete Live Integration Tests..."
echo "======================================"
echo ""

# Run the live tests
npx tsx scripts/test-live.ts

exit_code=$?

echo ""
echo "======================================"
if [ $exit_code -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Some tests failed (exit code: $exit_code)"
fi
echo "======================================"

exit $exit_code
