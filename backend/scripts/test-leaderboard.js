import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.model.js';
import { createHash } from 'crypto';

// Load environment variables
dotenv.config();

/**
 * Test Leaderboard Script
 * Creates test users with varying XP levels to populate leaderboard
 */

async function createTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Test users with different XP levels
    const testUsers = [
      { username: 'genius_master', genius: 2500, hustle: 1500, legend: 1000 },
      { username: 'hustle_king', genius: 1200, hustle: 2800, legend: 800 },
      { username: 'legend_hero', genius: 900, hustle: 1100, legend: 3200 },
      { username: 'balanced_pro', genius: 1800, hustle: 1800, legend: 1800 },
      { username: 'rising_star', genius: 500, hustle: 600, legend: 400 },
      { username: 'xp_hunter', genius: 3500, hustle: 2100, legend: 1400 },
      { username: 'top_climber', genius: 4200, hustle: 2500, legend: 1700 },
      { username: 'stat_master', genius: 1500, hustle: 3200, legend: 2100 },
      { username: 'level_seeker', genius: 800, hustle: 900, legend: 2800 },
      { username: 'xp_collector', genius: 2200, hustle: 1900, legend: 1600 }
    ];

    console.log('\nCreating test users...');

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ username: userData.username });
      
      if (existingUser) {
        console.log(`⚠ User ${userData.username} already exists, updating stats...`);
        
        // Update stats
        existingUser.stats = {
          climb: {
            genius: userData.genius,
            hustle: userData.hustle,
            legend: userData.legend
          },
          dark: {
            depth: 0,
            mystery: 0,
            wisdom: 0
          },
          philo: {
            logic: 0,
            insight: 0,
            impact: 0
          }
        };
        
        await existingUser.save();
        console.log(`✓ Updated ${userData.username}`);
      } else {
        // Create new user
        const user = new User({
          username: userData.username,
          password: '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNO', // Dummy hash
          stats: {
            climb: {
              genius: userData.genius,
              hustle: userData.hustle,
              legend: userData.legend
            },
            dark: {
              depth: 0,
              mystery: 0,
              wisdom: 0
            },
            philo: {
              logic: 0,
              insight: 0,
              impact: 0
            }
          }
        });
        
        await user.save();
        console.log(`✓ Created ${userData.username}`);
      }
    }

    console.log('\n✓ Test users created successfully!');
    console.log('\nLeaderboard Preview (Genius):');
    
    // Show top 5 for Genius stat
    const geniusLeaderboard = await User.find({})
      .sort({ 'stats.climb.genius': -1 })
      .limit(5)
      .select('username stats.climb.genius');
    
    geniusLeaderboard.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} - ${user.stats.climb.genius} XP`);
    });

    console.log('\nLeaderboard Preview (Hustle):');
    
    // Show top 5 for Hustle stat
    const hustleLeaderboard = await User.find({})
      .sort({ 'stats.climb.hustle': -1 })
      .limit(5)
      .select('username stats.climb.hustle');
    
    hustleLeaderboard.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} - ${user.stats.climb.hustle} XP`);
    });

    console.log('\nLeaderboard Preview (Legend):');
    
    // Show top 5 for Legend stat
    const legendLeaderboard = await User.find({})
      .sort({ 'stats.climb.legend': -1 })
      .limit(5)
      .select('username stats.climb.legend');
    
    legendLeaderboard.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} - ${user.stats.climb.legend} XP`);
    });

    console.log('\n✓ Test complete! You can now test the leaderboard at /leaderboard');

  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
  }
}

// Run the script
createTestUsers();
