import mongoose from 'mongoose';
import Circle from './src/models/Circle.model.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anotherme';

/**
 * Check script to see which circles have room assignments
 */

async function checkCircleRooms() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get all circles
    const allCircles = await Circle.find({}).lean();
    console.log(`=== Total Circles: ${allCircles.length} ===\n`);

    // Group by room
    const byRoom = {
      dark: [],
      climb: [],
      philo: [],
      unassigned: []
    };

    allCircles.forEach(circle => {
      if (!circle.room) {
        byRoom.unassigned.push(circle);
      } else {
        byRoom[circle.room].push(circle);
      }
    });

    // Display results
    console.log('📊 DARK ROOM CIRCLES:', byRoom.dark.length);
    byRoom.dark.forEach(c => {
      console.log(`  ✓ ${c.name}`);
      console.log(`    Categories: ${c.categories?.join(', ') || 'none'}`);
    });

    console.log('\n📊 CLIMB ROOM CIRCLES:', byRoom.climb.length);
    byRoom.climb.forEach(c => {
      console.log(`  ✓ ${c.name}`);
      console.log(`    Categories: ${c.categories?.join(', ') || 'none'}`);
    });

    console.log('\n📊 PHILO ROOM CIRCLES:', byRoom.philo.length);
    byRoom.philo.forEach(c => {
      console.log(`  ✓ ${c.name}`);
      console.log(`    Categories: ${c.categories?.join(', ') || 'none'}`);
    });

    console.log('\n⚠️  UNASSIGNED CIRCLES:', byRoom.unassigned.length);
    byRoom.unassigned.forEach(c => {
      console.log(`  ⚠ ${c.name}`);
      console.log(`    Description: ${c.description}`);
      console.log(`    Categories: ${c.categories?.join(', ') || 'none'}`);
      console.log(`    ID: ${c._id}`);
      console.log('');
    });

    if (byRoom.unassigned.length > 0) {
      console.log('\n💡 RECOMMENDATION:');
      console.log('Run the migration script to auto-assign rooms:');
      console.log('  node backend/migrate-circle-rooms.js');
      console.log('\nOr manually update circles in MongoDB:');
      console.log('  db.circles.updateOne({ _id: ObjectId("...") }, { $set: { room: "dark" } })');
    } else {
      console.log('\n✅ All circles have room assignments!');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed');
  }
}

checkCircleRooms();
