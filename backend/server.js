import dotenv from 'dotenv';
import { connectDatabase, setupGracefulShutdown } from './src/config/database.js';
import logger from './src/utils/logger.utils.js';

// Load environment variables FIRST
dotenv.config();

// Import app AFTER environment variables are loaded
const { default: app } = await import('./src/app.js');

const PORT = process.env.PORT || 5000;

// Connect to database and start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDatabase();
    
    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Setup graceful shutdown for database
    setupGracefulShutdown();
    
    return server;
  } catch (error) {
    logger.error('Failed to start server', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

// Start the server
const server = await startServer();
