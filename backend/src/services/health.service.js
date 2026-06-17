import mongoose from 'mongoose';
import { isConnectedToDatabase } from '../config/database.js';

/**
 * Check system health including database connection
 * @returns {Promise<Object>} Health status object
 */
export async function checkHealth() {
  const startTime = Date.now();
  
  // Check database connection
  const dbStatus = await checkDatabaseConnection();
  
  const responseTime = Date.now() - startTime;
  
  return {
    status: dbStatus.connected ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    responseTime: `${responseTime}ms`,
    environment: process.env.NODE_ENV || 'development',
  };
}

/**
 * Check database connection with ping
 * @returns {Promise<Object>} Database status object
 */
async function checkDatabaseConnection() {
  try {
    // Check if connected
    const connected = isConnectedToDatabase();
    
    if (!connected) {
      return {
        connected: false,
        status: 'disconnected',
        message: 'Database is not connected',
      };
    }
    
    // Ping database to verify connection
    const startTime = Date.now();
    await mongoose.connection.db.admin().ping();
    const pingTime = Date.now() - startTime;
    
    return {
      connected: true,
      status: 'connected',
      message: 'Database connection is healthy',
      pingTime: `${pingTime}ms`,
      readyState: mongoose.connection.readyState,
    };
  } catch (error) {
    return {
      connected: false,
      status: 'error',
      message: 'Database ping failed',
      error: error.message,
    };
  }
}
