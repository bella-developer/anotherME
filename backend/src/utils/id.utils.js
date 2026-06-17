import crypto from 'crypto';

/**
 * ID Utilities
 * Handles opaque ID encoding/decoding for MongoDB ObjectIds
 * Prevents enumeration attacks by obscuring sequential IDs
 */

/**
 * Generate opaque ID from MongoDB ObjectId
 * Creates a deterministic but non-reversible hash
 * 
 * @param {string} mongoId - MongoDB ObjectId as string
 * @returns {string} Opaque ID (hex string)
 * @throws {Error} If mongoId is invalid
 */
export function generateOpaqueId(mongoId) {
  if (!mongoId || typeof mongoId !== 'string') {
    throw new Error('Invalid MongoDB ID');
  }
  
  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }
  
  // Create opaque ID by hashing the MongoDB ID directly
  // This ensures the same ID always produces the same opaque ID
  const opaqueId = crypto
    .createHmac('sha256', process.env.SESSION_SECRET)
    .update(mongoId)
    .digest('hex')
    .substring(0, 12);
  
  return opaqueId;
}

/**
 * Decode opaque ID back to MongoDB ObjectId
 * Since opaque IDs are not cryptographically reversible,
 * this function treats the input as a MongoDB ObjectId directly
 * 
 * @param {string} id - ID to decode (can be opaque ID or MongoDB ObjectId)
 * @returns {string} MongoDB ObjectId
 */
export function decodeOpaqueId(id) {
  // For now, we'll just return the ID as-is
  // In a real implementation, you'd maintain a mapping table
  // or use a reversible encoding scheme
  // Since we're using opaque IDs only for display, services should use MongoDB IDs directly
  return id;
}
