#!/bin/bash

API_URL="http://localhost:5000/api"

echo "=== Testing Circle Comment Replies ==="
echo ""

# Step 1: Get a circle ID
echo "1. Fetching circles..."
CIRCLES_RESPONSE=$(curl -s "${API_URL}/circles")
CIRCLE_ID=$(echo $CIRCLES_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Circle ID: $CIRCLE_ID"
echo ""

# Step 2: Get comments for this circle
echo "2. Fetching comments for circle..."
COMMENTS_RESPONSE=$(curl -s "${API_URL}/circles/${CIRCLE_ID}/comments")
echo "Comments response:"
echo $COMMENTS_RESPONSE | jq '.' 2>/dev/null || echo $COMMENTS_RESPONSE
echo ""

# Extract first comment ID
COMMENT_ID=$(echo $COMMENTS_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Comment ID to reply to: $COMMENT_ID"
echo ""

# Step 3: Create a reply (requires authentication)
echo "3. Creating reply to comment..."
echo "Note: This will fail without authentication cookie"
REPLY_RESPONSE=$(curl -s -X POST "${API_URL}/comments/${COMMENT_ID}/replies" \
  -H "Content-Type: application/json" \
  -d '{"content": "This is a test reply from curl"}')
echo "Reply response:"
echo $REPLY_RESPONSE | jq '.' 2>/dev/null || echo $REPLY_RESPONSE
echo ""

echo "=== Test Complete ==="
