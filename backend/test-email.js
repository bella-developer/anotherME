/**
 * Standalone email test script
 * Run with: node test-email.js
 */

import dotenv from 'dotenv';
import { sendWelcomeEmail } from './src/services/email.service.js';

dotenv.config();

async function testEmail() {
  console.log('Starting email test...');
  console.log('RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);
  console.log('RESEND_API_KEY length:', process.env.RESEND_API_KEY?.length);
  
  try {
    const result = await sendWelcomeEmail('test@example.com', 'TestUser');
    console.log('Email result:', result);
  } catch (error) {
    console.error('Email error:', error);
  }
}

testEmail();
