import express from 'express';
import Circle from '../models/Circle.model.js';
import { authenticate } from '../middlewares/auth.middleware.js';

/**
 * Admin Routes (Temporary - for development/migration only)
 * These should be removed or protected in production
 */

const router = express.Router();

/**
 * POST /api/admin/migrate-circle-rooms
 * Migrate existing circles to have room assignments
 */
router.post('/migrate-circle-rooms', authenticate, async (req, res) => {
  try {
    // Get all circles without room assignment
    const circles = await Circle.find({ 
      $or: [{ room: null }, { room: { $exists: false } }] 
    });

    // Room keywords for automatic detection
    const roomKeywords = {
      dark: ['dark', 'confession', 'regret', 'shadow', 'grief', 'loss', 'anxiety', 'fear', 'lonely', 'sad', 'pain', 'twilight'],
      climb: ['startup', 'idea', 'business', 'entrepreneur', 'venture', 'future', 'innovation', 'climb', 'growth', 'build', 'summit', 'seeker'],
      philo: ['philo', 'spiritual', 'deep', 'thought', 'wisdom', 'reflect', 'contemplate', 'meaning', 'soul', 'meditation', 'ai', 'talk']
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

    const results = {
      total: circles.length,
      updated: [],
      skipped: []
    };

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
        results.updated.push({
          name: circle.name,
          room: detectedRoom
        });
      } else {
        results.skipped.push({
          id: circle._id.toString(),
          name: circle.name,
          description: circle.description
        });
      }
    }

    res.json({
      status: 'success',
      message: 'Circle room migration complete',
      data: results
    });

  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to migrate circles',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/check-circle-rooms
 * Check current room assignments
 */
router.get('/check-circle-rooms', authenticate, async (req, res) => {
  try {
    const allCircles = await Circle.find({}).lean();
    
    const byRoom = {
      dark: [],
      climb: [],
      philo: [],
      unassigned: []
    };

    allCircles.forEach(circle => {
      const circleInfo = {
        id: circle._id.toString(),
        name: circle.name,
        categories: circle.categories || []
      };

      if (!circle.room) {
        byRoom.unassigned.push(circleInfo);
      } else {
        byRoom[circle.room].push(circleInfo);
      }
    });

    res.json({
      status: 'success',
      data: {
        total: allCircles.length,
        byRoom,
        summary: {
          dark: byRoom.dark.length,
          climb: byRoom.climb.length,
          philo: byRoom.philo.length,
          unassigned: byRoom.unassigned.length
        }
      }
    });

  } catch (error) {
    console.error('Check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to check circles',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/assign-circle-room/:circleId
 * Manually assign a room to a specific circle
 */
router.post('/assign-circle-room/:circleId', authenticate, async (req, res) => {
  try {
    const { circleId } = req.params;
    const { room } = req.body;

    if (!['dark', 'climb', 'philo'].includes(room)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid room. Must be: dark, climb, or philo'
      });
    }

    const circle = await Circle.findByIdAndUpdate(
      circleId,
      { room },
      { new: true }
    );

    if (!circle) {
      return res.status(404).json({
        status: 'error',
        message: 'Circle not found'
      });
    }

    res.json({
      status: 'success',
      message: `Circle "${circle.name}" assigned to ${room} room`,
      data: {
        id: circle._id.toString(),
        name: circle.name,
        room: circle.room
      }
    });

  } catch (error) {
    console.error('Assignment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to assign room',
      error: error.message
    });
  }
});

export default router;
