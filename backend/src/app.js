import express from 'express';
import {
  requestIdMiddleware,
  requestLoggerMiddleware,
  notFoundHandler,
  errorHandler,
} from './middlewares/errorHandler.middleware.js';
import {
  helmetConfig,
  corsConfig,
  httpsRedirect,
  additionalSecurityHeaders,
} from './middlewares/security.middleware.js';
import { createSessionMiddleware } from './config/session.js';

const app = express();

// HTTPS redirect (must be first in production)
app.use(httpsRedirect);

// Request ID middleware
app.use(requestIdMiddleware);

// Request logger middleware
app.use(requestLoggerMiddleware);

// Security headers (Helmet)
app.use(helmetConfig);

// Additional security headers
app.use(additionalSecurityHeaders);

// CORS configuration with origin validation (must be before session)
app.use(corsConfig());

// Session middleware (must be after CORS)
// Lazy initialization to ensure env vars are loaded
let sessionMiddleware = null;
app.use((req, res, next) => {
  if (!sessionMiddleware) {
    sessionMiddleware = createSessionMiddleware();
  }
  sessionMiddleware(req, res, next);
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import routes
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import circleRoutes from './routes/circle.routes.js';
import postRoutes from './routes/post.routes.js';
import commentRoutes from './routes/comment.routes.js';
import categoryRoutes from './routes/category.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import adminRoutes from './routes/admin.routes.js';
import supportRoutes from './routes/support.routes.js';
import { sendWelcomeEmail } from './services/email.service.js';

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'ESO API' });
});

// Test email endpoint (temporary - remove in production)
app.get('/api/test-email', async (req, res) => {
  try {
    // Use query parameter or default email
    const testEmail = req.query.email || 'test@example.com';
    const result = await sendWelcomeEmail(testEmail, 'TestUser');
    res.json({ 
      success: result.success, 
      result,
      gmailConfigured: !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD),
      gmailUser: process.env.GMAIL_USER || 'not configured',
      testEmail,
      instructions: 'Visit /api/test-email?email=your@email.com to test'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      gmailConfigured: !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
    });
  }
});

// Health check routes
app.use('/api/health', healthRoutes);

// Authentication routes
app.use('/api/auth', authRoutes);

// User routes
app.use('/api/users', userRoutes);

// Circle routes
app.use('/api/circles', circleRoutes);

// Post routes
app.use('/api/posts', postRoutes);

// Comment routes
app.use('/api', commentRoutes);

// Category routes
app.use('/api/categories', categoryRoutes);

// Notification routes
app.use('/api/notifications', notificationRoutes);

// Support routes
app.use('/api/support', supportRoutes);

// Admin routes (temporary - for development/migration)
app.use('/api/admin', adminRoutes);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
