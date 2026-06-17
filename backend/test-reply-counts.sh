#!/bin/bash

# Test script to verify reply counts are bubbling up correctly
# This tests the complete thread hierarchy

echo "=== Testing Reply Count Bubbling ==="
echo ""

# Get session cookie
COOKIE_FILE="session_cookie.txt"

if [ ! -f "$COOKIE_FILE" ]; then
  echo "Error: $COOKIE_FILE not found. Please login first."
  exit 1
fi

# Get circle ID (using the first circle from the database)
CIRCLE_ID="6972243561df0327723e1798"

echo "1. Fetching comments for circle $CIRCLE_ID..."
echo ""

curl -s -X GET "http://localhost:5000/api/circles/$CIRCLE_ID/comments" \
  -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" | jq '.'

echo ""
echo "=== Expected Reply Counts ==="
echo "- 'let's discuss this' should show replyCount: 3 (has 3 descendants total)"
echo "- 'raise your idea' should show replyCount: 2 (has 2 descendants)"
echo "- 'cool' should show replyCount: 1 (has 1 descendant)"
echo "- 'good' should show replyCount: 0 (no descendants)"
echo ""
echo "=== Verification ==="
echo "Check the replyCount field for each comment above."
echo "The counts should match the total number of descendants, not just immediate children."
