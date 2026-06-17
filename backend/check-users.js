#!/usr/bin/env node

import mongoose from 'mongoose';
import User from './src/models/User.model.js';
import { verifyPassword } from './src/utils/password.utils.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anotherme';

async function checkUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    const users = await User.find({ username: { $in: ['testuser1', 'testuser2', 'testuser3'] } });
    
    console.log(`Found ${users.length} test users:\n`);
    
    for (const user of users) {
      console.log(`Username: ${user.username}`);
      console.log(`Has password: ${!!user.password}`);
      console.log(`Password length: ${user.password?.length || 0}`);
      
      // Try to verify with test password
      try {
        const isValid = await verifyPassword('Password123!', user.password);
        console.log(`Password 'Password123!' valid: ${isValid}`);
      } catch (err) {
        console.log(`Password verification error: ${err.message}`);
      }
      console.log('---\n');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Database connection closed');
  }
}

checkUsers();
