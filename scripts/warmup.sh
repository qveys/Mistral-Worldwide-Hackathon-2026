#!/bin/bash
# EchoMaps Pre-Demo Warmup Script
# Ensures backend is responsive before demo

API_URL=${API_URL:-http://localhost:4000}
MAX_RETRIES=5
RETRY_DELAY=2

echo "🔥 EchoMaps Warmup - Preparing for demo..."

# Wait for backend to be ready
for i in $(seq 1 $MAX_RETRIES); do
  echo "  Attempt $i/$MAX_RETRIES: Checking $API_URL/health..."
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health" 2>/dev/null)

  if [ "$RESPONSE" = "200" ]; then
    echo "  ✅ Backend is ready!"
    break
  fi

  if [ "$i" = "$MAX_RETRIES" ]; then
    echo "  ❌ Backend not responding after $MAX_RETRIES attempts"
    exit 1
  fi

  echo "  ⏳ Waiting ${RETRY_DELAY}s..."
  sleep $RETRY_DELAY
done

# Warm up endpoints
echo ""
echo "📡 Warming up endpoints..."

curl -s "$API_URL/health" > /dev/null && echo "  ✅ GET /health"
curl -s "$API_URL/api/templates" > /dev/null 2>&1 && echo "  ✅ GET /api/templates" || echo "  ⚠️  GET /api/templates (not available)"

echo ""
echo "🎯 Warmup complete! Ready for demo."
