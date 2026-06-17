import express from 'express';
import SupportResource from '../models/supportResource.model.js';

const router = express.Router();

/**
 * GET /api/support/resources
 * Get all support resources, optionally filtered by type
 */
router.get('/resources', async (req, res) => {
  try {
    const { type } = req.query;
    
    const query = { active: true };
    if (type) {
      query.type = type;
    }

    const resources = await SupportResource.find(query).sort({ order: 1, createdAt: 1 });
    
    res.json({
      success: true,
      data: resources
    });
  } catch (error) {
    console.error('Error fetching support resources:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support resources'
    });
  }
});

/**
 * GET /api/support/resources/:id
 * Get a single support resource by ID
 */
router.get('/resources/:id', async (req, res) => {
  try {
    const resource = await SupportResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Support resource not found'
      });
    }

    res.json({
      success: true,
      data: resource
    });
  } catch (error) {
    console.error('Error fetching support resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support resource'
    });
  }
});

export default router;
