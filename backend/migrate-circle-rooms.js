import mongoose from 'mongoose';
import Circle from './src/models/Circle.model.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anotherme';

/**
 * Migration script to assign room types to existing circles
 * This script analyzes circle names and categories to determine the appropriate room
 */

async function migrateCircleRooms() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get all circles without room assignment
    const circles = await Circle.find({ $or: [{ room: null }, { room: { $exists: false } }] });
    console.log(`Found ${circles.length} circles without room assignment\n`);

    if (circles.length === 0) {
      console.log('No circles to migrate. All circles already have room assignments.');
      return;
    }

    // Room keywords for automatic detection
    const roomKeywords = {
      dark: ['dark', 'confession', 'regret', 'shadow', 'grief', 'loss', 'anxiety', 'fear', 'lonely', 'sad', 'pain'],
      climb: ['startup', 'idea', 'business', 'entrepreneur', 'venture', 'future', 'innovation', 'climb', 'growth', 'build'],
      philo: ['philo', 'spiritual', 'deep', 'thought', 'wisdom', 'reflect', 'contemplate', 'meaning', 'soul', 'meditation']
    };

    // Category mappings
    const categoryToRoom = {
      'CONFESSION': 'dark',
      'REGRET': 'dark',
      'DARK': 'dark',
      'IDEA': 'climb',
      'FUTURISTIC': 'climb',
      'BUSINESS': 'climb',
      'ENTREPRENEUR': 'climb',
      'SPIRITUAL': 'philo',
      'SHADOW': 'philo',
      'DEEP': 'philo'
    };

    let updated = 0;
    let skipped = 0;

    for (const circle of circles) {
      let detectedRoom = null;

      // First, try to detect by categories
      if (circle.categories && circle.categories.length > 0) {
        for (const category of circle.categories) {
          if (categoryToRoom[category]) {
            detectedRoom = categoryToRoom[category];
            break;
          }
        }
      }

      // If no room detected by category, try by name/description keywords
      if (!detectedRoom) {
        const searchText = `${circle.name} ${circle.description}`.toLowerCase();
        
        for (const [room, keywords] of Object.entries(roomKeywords)) {
          if (keywords.some(keyword => searchText.includes(keyword))) {
            detectedRoom = room;
            break;
          }
        }
      }

      if (detectedRoom) {
        await Circle.findByIdAndUpdate(circle._id, { room: detectedRoom });
        console.log(`✓ Updated "${circle.name}" → ${detectedRoom.toUpperCase()} room`);
        updated++;
      } else {
        console.log(`⚠ Skipped "${circle.name}" (could not determine room)`);
        skipped++;
      }
    }

    console.log('\n=== Migration Complete ===');
    console.log(`Updated: ${updated} circles`);
    console.log(`Skipped: ${skipped} circles`);
    
    if (skipped > 0) {
      console.log('\nCircles that were skipped need manual room assignment.');
      console.log('You can update them using the MongoDB shell or create them again from the appropriate room.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed');
  }
}

migrateCircleRooms();
