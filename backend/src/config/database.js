import mongoose from 'mongoose';
import logger from '../utils/logger.utils.js';

/**
 * Database configuration module
 * Handles MongoDB connection with connection pooling, error handling, and retry logic
 * Optimized for free-tier constraints (MongoDB Atlas M0)
 */

let isConnected = false;

/**
 * Connect to MongoDB with retry logic and connection pooling
 * @returns {Promise<void>}
 */
export async function connectDatabase() {
  // If already connected, return early
  if (isConnected) {
    logger.info('Using existing database connection');
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    // Connection options optimized for free-tier constraints
    const options = {
      maxPoolSize: 10,              // Free tier connection limit
      minPoolSize: 2,               // Maintain minimum connections
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      socketTimeoutMS: 45000,       // Socket timeout
      family: 4,                    // Use IPv4
      retryWrites: true,            // Retry failed writes
      w: 'majority'                 // Write concern
    };

    // Connect to MongoDB
    await mongoose.connect(mongoUri, options);
    
    isConnected = true;
    logger.info('MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error', { error: error.message });
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully');
      isConnected = true;
    });

  } catch (error) {
    logger.error('Failed to connect to MongoDB', { error: error.message });
    isConnected = false;
    
    // Retry connection after delay
    logger.info('Retrying connection in 5 seconds...');
    setTimeout(connectDatabase, 5000);
    
    throw error;
  }
}

/**
 * Disconnect from MongoDB gracefully
 * @returns {Promise<void>}
 */
export async function disconnectDatabase() {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.connection.close();
    isConnected = false;
    logger.info('MongoDB disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB', { error: error.message });
    throw error;
  }
}

/**
 * Get connection status
 * @returns {boolean}
 */
export function isConnectedToDatabase() {
  return isConnected && mongoose.connection.readyState === 1;
}

/**
 * Handle graceful shutdown
 */
export function setupGracefulShutdown() {
  const shutdown = async (signal) => {
    logger.info(`${signal} received. Closing MongoDB connection...`);
    try {
      await disconnectDatabase();
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown', { error: error.message });
      process.exit(1);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}
