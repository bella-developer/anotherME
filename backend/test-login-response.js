#!/usr/bin/env node

/**
 * Test script to verify login response includes role field
 * Run this after deploying the backend to verify the fix
 */

import dotenv from 'dotenv';
dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

async function testLoginResponse() {
  console.log(`Testing backend at: ${BACKEND_URL}\n`);
  
  try {
    // Test with admin user credentials
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'belewa', // The admin user's username
        password: 'YourPasswordHere' // Replace with actual password
      })
    });

    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response body:', JSON.stringify(data, null, 2));
    
    if (data.data?.user) {
      console.log('\n✓ User object returned');
      console.log('  Username:', data.data.user.username);
      console.log('  Email:', data.data.user.email);
      
      if (data.data.user.role) {
        console.log(`  Role: ${data.data.user.role} ✓`);
        if (data.data.user.role === 'admin') {
          console.log('\n✅ SUCCESS: Admin role is present in response!');
        } else {
          console.log('\n⚠️  Role field exists but is not "admin"');
        }
      } else {
        console.log('  Role: MISSING ❌');
        console.log('\n❌ FAIL: Role field is not in the response');
        console.log('The backend still has the old code. Wait for deployment or trigger manual redeploy.');
      }
    } else {
      console.log('\n❌ Login failed or unexpected response structure');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testLoginResponse();
