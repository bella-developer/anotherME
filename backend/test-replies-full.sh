#!/bin/bash

API_URL="http://localhost:5000/api"
COOKIE_FILE="test-cookies.txt"

echo "=== Full Circle Reply Test with Authentication ==="
echo ""

# Step 1: Register/Login
echo "1. Registering user..."
REGISTER_RESPONSE=$(curl -s -c $COOKIE_FILE -X POST "${API_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"age": 25, "gender": "other"}')
echo "Register response:"
echo $REGISTER_RESPONSE | jq '.' 2>/dev/null || echo $REGISTER_RESPONSE
echo ""

# Step 2: Get a circle
echo "2. Fetching circles..."
CIRCLES_RESPONSE=$(curl -s "${API_URL}/circles")
CIRCLE_ID=$(echo $CIRCLES_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Circle ID: $CIRCLE_ID"
echo ""

# Step 3: Create a comment in the circle
echo "3. Creating a comment in circle..."
COMMENT_RESPONSE=$(curl -s -b $COOKIE_FILE -X POST "${API_URL}/circles/${CIRCLE_ID}/comments" \
  -H "Content-Type: application/json" \
  -d '{"content": "This is a test comment for reply testing"}')
echo "Comment response:"
echo $COMMENT_RESPONSE | jq '.' 2>/dev/null || echo $COMMENT_RESPONSE
COMMENT_ID=$(echo $COMMENT_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Created comment ID: $COMMENT_ID"
echo ""

# Step 4: Create a reply to the comment
echo "4. Creating reply to comment..."
REPLY_RESPONSE=$(curl -s -b $COOKIE_FILE -X POST "${API_URL}/comments/${COMMENT_ID}/replies" \
  -H "Content-Type: application/json" \
  -d '{"content": "This is a test reply!"}')
echo "Reply response:"
echo $REPLY_RESPONSE | jq '.' 2>/dev/null || echo $REPLY_RESPONSE
echo ""

# Step 5: Fetch comments again to see the reply
echo "5. Fetching comments to verify reply..."
COMMENTS_RESPONSE=$(curl -s "${API_URL}/circles/${CIRCLE_ID}/comments")
echo "Comments with replies:"
echo $COMMENTS_RESPONSE | jq '.' 2>/dev/null || echo $COMMENTS_RESPONSE
echo ""

# Cleanup
rm -f $COOKIE_FILE

echo "=== Test Complete ==="
