const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const passport = require('../config/passport.config');

// Standard auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/session', authenticateToken, authController.getSession);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendURL}/home`);
  }
);

module.exports = router;
