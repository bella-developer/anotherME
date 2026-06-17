#!/bin/bash

# Test script for login system
# Tests registration, login, and account locking

API_URL="http://localhost:5000/api"
COOKIE_FILE="/tmp/test_cookies.txt"

echo "=== Testing Secure Login System ==="
echo ""

# Test 1: Register with auto-generated username
echo "Test 1: Register with auto-generated username"
RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"password": "AutoGen123!", "age": 25, "gender": "female"}' \
  -c "$COOKIE_FILE")

USERNAME=$(echo "$RESPONSE" | jq -r '.data.user.username')
ALIAS=$(echo "$RESPONSE" | jq -r '.data.user.alias')

if [ "$USERNAME" != "null" ]; then
  echo "✓ Registration successful"
  echo "  Username: $USERNAME"
  echo "  Alias: $ALIAS"
else
  echo "✗ Registration failed"
  echo "$RESPONSE" | jq .
  exit 1
fi
echo ""

# Test 2: Login with correct credentials
echo "Test 2: Login with correct credentials"
RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME\", \"password\": \"AutoGen123!\"}" \
  -c "$COOKIE_FILE")

STATUS=$(echo "$RESPONSE" | jq -r '.status')
if [ "$STATUS" = "success" ]; then
  echo "✓ Login successful"
else
  echo "✗ Login failed"
  echo "$RESPONSE" | jq .
  exit 1
fi
echo ""

# Test 3: Get session
echo "Test 3: Get session with cookie"
RESPONSE=$(curl -s -X GET "$API_URL/auth/session" \
  -b "$COOKIE_FILE")

SESSION_ALIAS=$(echo "$RESPONSE" | jq -r '.data.user.alias')
if [ "$SESSION_ALIAS" = "$ALIAS" ]; then
  echo "✓ Session valid"
else
  echo "✗ Session invalid"
  echo "$RESPONSE" | jq .
  exit 1
fi
echo ""

# Test 4: Logout
echo "Test 4: Logout"
RESPONSE=$(curl -s -X POST "$API_URL/auth/logout" \
  -b "$COOKIE_FILE")

STATUS=$(echo "$RESPONSE" | jq -r '.status')
if [ "$STATUS" = "success" ]; then
  echo "✓ Logout successful"
else
  echo "✗ Logout failed"
  echo "$RESPONSE" | jq .
  exit 1
fi
echo ""

# Test 5: Register with custom username
echo "Test 5: Register with custom username"
CUSTOM_USER="secure_test_$(date +%s)"
RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$CUSTOM_USER\", \"password\": \"CustomPass123!\"}")

REG_USERNAME=$(echo "$RESPONSE" | jq -r '.data.user.username')
if [ "$REG_USERNAME" = "$CUSTOM_USER" ]; then
  echo "✓ Custom username registration successful"
  echo "  Username: $REG_USERNAME"
else
  echo "✗ Custom username registration failed"
  echo "$RESPONSE" | jq .
  exit 1
fi
echo ""

# Test 6: Login with wrong password (should fail)
echo "Test 6: Login with wrong password"
RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$CUSTOM_USER\", \"password\": \"WrongPassword123!\"}")

CODE=$(echo "$RESPONSE" | jq -r '.code')
if [ "$CODE" = "INVALID_CREDENTIALS" ]; then
  echo "✓ Wrong password rejected correctly"
else
  echo "✗ Wrong password handling failed"
  echo "$RESPONSE" | jq .
  exit 1
fi
echo ""

# Test 7: Password strength validation
echo "Test 7: Weak password rejection"
RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "weak_test", "password": "weak"}')

CODE=$(echo "$RESPONSE" | jq -r '.code')
if [ "$CODE" = "WEAK_PASSWORD" ] || [ "$CODE" = "VALIDATION_ERROR" ]; then
  echo "✓ Weak password rejected"
else
  echo "✗ Weak password validation failed"
  echo "$RESPONSE" | jq .
  exit 1
fi
echo ""

echo "=== All Tests Passed! ==="
echo ""
echo "Summary:"
echo "- Auto-generated username: ✓"
echo "- Custom username: ✓"
echo "- Login/Logout: ✓"
echo "- Session management: ✓"
echo "- Password validation: ✓"
echo "- Wrong password handling: ✓"
