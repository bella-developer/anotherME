/**
 * Script to set admin role for specific email
 * Run this once to upgrade existing user to admin
 * Usage: node backend/scripts/set-admin-role.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../src/models/User.model.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: join(__dirname, '../.env') });

const ADMIN_EMAIL = 'belackhaile@gmail.com';

async function setAdminRole() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email: ADMIN_EMAIL });

    if (!user) {
      console.log(`No user found with email: ${ADMIN_EMAIL}`);
      console.log('Admin role will be assigned automatically when this email registers/logs in.');
    } else {
      // Update user role to admin
      user.role = 'admin';
      await user.save();
      console.log(`✓ Successfully set admin role for user: ${user.username} (${user.email})`);
      console.log(`User role: ${user.role}`);
    }

    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error setting admin role:', error);
    process.exit(1);
  }
}

setAdminRole();
