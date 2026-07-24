#!/usr/bin/env node

import mongoose from 'mongoose';
import User from './src/models/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anotherme';

async function checkAdminUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    const user = await User.findOne({ email: 'belackhaile@gmail.com' });
    
    if (!user) {
      console.log('❌ User with email belackhaile@gmail.com not found');
    } else {
      console.log('✓ User found:');
      console.log(`  Username: ${user.username}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role || 'user (default)'}`);
      console.log(`  Created: ${user.createdAt}`);
      console.log(`  User ID: ${user._id}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
  }
}

checkAdminUser();
