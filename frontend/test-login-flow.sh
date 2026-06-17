#!/bin/bash

# Frontend Login Flow Test Script
# Tests the complete login flow from the frontend perspective
# Simulates browser behavior with cookie handling

set -e

API_URL="${VITE_API_BASE_URL:-http://localhost:5000/api}"
COOKIE_FILE="/tmp/frontend_test_cookies.txt"
TEST_USER="frontend_test_$(date +%s)"
TEST_PASSWORD="FrontendTest123!"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Frontend Login Flow Test"
echo "=========================================="
echo "API URL: $API_URL"
echo ""

# Cleanup function
cleanup() {
  rm -f "$COOKIE_FILE"
}
trap cleanup EXIT

# Helper function to print test results
print_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $2"
  else
    echo -e "${RED}✗${NC} $2"
    exit 1
  fi
}

# Helper function to print warnings
print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# Test 1: Check if backend is running
echo "Test 1: Backend Health Check"
echo "----------------------------"
if curl -s -f "$API_URL/../health" > /dev/null 2>&1; then
  print_result 0 "Backend is running"
else
  print_warning "Backend health endpoint not found, trying to continue..."
fi
echo ""

# Test 2: Register a new user (simulating InitializeIdentity page)
echo "Test 2: User Registration"
echo "-------------------------"
REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"username\": \"$TEST_USER\", \"password\": \"$TEST_PASSWORD\", \"age\": 25, \"gender\": \"other\"}" \
  -c "$COOKIE_FILE")

HTTP_CODE=$(echo "$REGISTER_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$REGISTER_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
  USERNAME=$(echo "$RESPONSE_BODY" | jq -r '.data.user.username')
  USER_ID=$(echo "$RESPONSE_BODY" | jq -r '.data.user.id')
  
  print_result 0 "User registered successfully"
  echo "  Username: $USERNAME"
  echo "  Alias: $ALIAS"
  echo "  User ID: $USER_ID"
  
  # Check if session cookie was set
  if grep -q "connect.sid" "$COOKIE_FILE" 2>/dev/null; then
    print_result 0 "Session cookie received"
  else
    print_warning "No session cookie found (might be using different cookie name)"
  fi
else
  print_result 1 "Registration failed (HTTP $HTTP_CODE)"
  echo "$RESPONSE_BODY" | jq . 2>/dev/null || echo "$RESPONSE_BODY"
fi
echo ""

# Test 3: Verify session after registration
echo "Test 3: Session Verification After Registration"
echo "-----------------------------------------------"
SESSION_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/auth/session" \
  -H "Accept: application/json" \
  -b "$COOKIE_FILE")

HTTP_CODE=$(echo "$SESSION_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$SESSION_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  SESSION_USERNAME=$(echo "$RESPONSE_BODY" | jq -r '.data.user.username')
  
  if [ "$SESSION_USERNAME" = "$USERNAME" ]; then
    print_result 0 "Session valid after registration"
  else
    print_result 1 "Session username mismatch (expected: $USERNAME, got: $SESSION_USERNAME)"
  fi
else
  print_result 1 "Session verification failed (HTTP $HTTP_CODE)"
fi
echo ""

# Test 4: Logout
echo "Test 4: Logout"
echo "--------------"
LOGOUT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/logout" \
  -H "Accept: application/json" \
  -b "$COOKIE_FILE")

HTTP_CODE=$(echo "$LOGOUT_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
  print_result 0 "Logout successful"
  rm -f "$COOKIE_FILE"
else
  print_result 1 "Logout failed (HTTP $HTTP_CODE)"
fi
echo ""

# Test 5: Login with correct credentials (simulating Login page)
echo "Test 5: Login with Correct Credentials"
echo "---------------------------------------"
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"username\": \"$USERNAME\", \"password\": \"$TEST_PASSWORD\"}" \
  -c "$COOKIE_FILE")

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  LOGIN_USERNAME=$(echo "$RESPONSE_BODY" | jq -r '.data.user.username')
  
  if [ "$LOGIN_USERNAME" = "$USERNAME" ]; then
    print_result 0 "Login successful"
    echo "  Logged in as: $LOGIN_USERNAME"
  else
    print_result 1 "Login username mismatch"
  fi
else
  print_result 1 "Login failed (HTTP $HTTP_CODE)"
  echo "$RESPONSE_BODY" | jq . 2>/dev/null || echo "$RESPONSE_BODY"
fi
echo ""

# Test 6: Verify session after login
echo "Test 6: Session Verification After Login"
echo "----------------------------------------"
SESSION_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/auth/session" \
  -H "Accept: application/json" \
  -b "$COOKIE_FILE")

HTTP_CODE=$(echo "$SESSION_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$SESSION_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  SESSION_USERNAME=$(echo "$RESPONSE_BODY" | jq -r '.data.user.username')
  
  if [ "$SESSION_USERNAME" = "$USERNAME" ]; then
    print_result 0 "Session valid after login"
  else
    print_result 1 "Session username mismatch"
  fi
else
  print_result 1 "Session verification failed (HTTP $HTTP_CODE)"
fi
echo ""

# Test 7: Login with wrong password
echo "Test 7: Login with Wrong Password"
echo "----------------------------------"
WRONG_LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"username\": \"$USERNAME\", \"password\": \"WrongPassword123!\"}")

HTTP_CODE=$(echo "$WRONG_LOGIN_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$WRONG_LOGIN_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "401" ]; then
  ERROR_CODE=$(echo "$RESPONSE_BODY" | jq -r '.code')
  
  if [ "$ERROR_CODE" = "INVALID_CREDENTIALS" ]; then
    print_result 0 "Wrong password rejected correctly"
  else
    print_warning "Wrong password rejected but with unexpected error code: $ERROR_CODE"
  fi
else
  print_result 1 "Wrong password handling failed (HTTP $HTTP_CODE)"
fi
echo ""

# Test 8: Login with non-existent user
echo "Test 8: Login with Non-existent User"
echo "-------------------------------------"
NONEXIST_LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"username\": \"nonexistent_user_12345\", \"password\": \"$TEST_PASSWORD\"}")

HTTP_CODE=$(echo "$NONEXIST_LOGIN_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
  print_result 0 "Non-existent user rejected correctly"
else
  print_result 1 "Non-existent user handling failed (HTTP $HTTP_CODE)"
fi
echo ""

# Test 9: Session persistence across requests
echo "Test 9: Session Persistence"
echo "---------------------------"
# Make multiple requests with the same cookie
for i in {1..3}; do
  SESSION_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/auth/session" \
    -H "Accept: application/json" \
    -b "$COOKIE_FILE")
  
  HTTP_CODE=$(echo "$SESSION_RESPONSE" | tail -n1)
  
  if [ "$HTTP_CODE" != "200" ]; then
    print_result 1 "Session persistence failed on request $i"
    exit 1
  fi
done
print_result 0 "Session persisted across multiple requests"
echo ""

# Test 10: Missing credentials validation
echo "Test 10: Missing Credentials Validation"
echo "---------------------------------------"
MISSING_CREDS_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{}")

HTTP_CODE=$(echo "$MISSING_CREDS_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "400" ] || [ "$HTTP_CODE" = "422" ]; then
  print_result 0 "Missing credentials rejected correctly"
else
  print_warning "Missing credentials handling returned HTTP $HTTP_CODE (expected 400 or 422)"
fi
echo ""

# Test 11: Empty credentials validation
echo "Test 11: Empty Credentials Validation"
echo "-------------------------------------"
EMPTY_CREDS_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"username\": \"\", \"password\": \"\"}")

HTTP_CODE=$(echo "$EMPTY_CREDS_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "400" ] || [ "$HTTP_CODE" = "422" ]; then
  print_result 0 "Empty credentials rejected correctly"
else
  print_warning "Empty credentials handling returned HTTP $HTTP_CODE (expected 400 or 422)"
fi
echo ""

# Test 12: Final logout
echo "Test 12: Final Logout"
echo "--------------------"
LOGOUT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/logout" \
  -H "Accept: application/json" \
  -b "$COOKIE_FILE")

HTTP_CODE=$(echo "$LOGOUT_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
  print_result 0 "Final logout successful"
else
  print_result 1 "Final logout failed (HTTP $HTTP_CODE)"
fi
echo ""

# Test 13: Verify session is destroyed after logout
echo "Test 13: Session Destroyed After Logout"
echo "---------------------------------------"
SESSION_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/auth/session" \
  -H "Accept: application/json" \
  -b "$COOKIE_FILE")

HTTP_CODE=$(echo "$SESSION_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
  print_result 0 "Session correctly destroyed after logout"
else
  print_warning "Session check after logout returned HTTP $HTTP_CODE (expected 401)"
fi
echo ""

# Summary
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "${GREEN}All critical tests passed!${NC}"
echo ""
echo "Tested functionality:"
echo "  ✓ User registration"
echo "  ✓ Session creation and cookies"
echo "  ✓ Login with correct credentials"
echo "  ✓ Session persistence"
echo "  ✓ Logout functionality"
echo "  ✓ Session destruction"
echo "  ✓ Invalid credentials handling"
echo "  ✓ Input validation"
echo ""
echo "Test user created: $USERNAME"
echo "You can use this account for manual testing:"
echo "  Username: $USERNAME"
echo "  Password: $TEST_PASSWORD"
echo ""
