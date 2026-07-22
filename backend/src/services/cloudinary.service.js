import cloudinary from '../config/cloudinary.config.js';
import { Readable } from 'stream';

/**
 * Cloudinary Service
 * Handles image uploads to Cloudinary
 */

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object>} Upload result with URL
 */
export async function uploadImage(fileBuffer, folder = 'eso/posts') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' }, // Max dimensions
          { quality: 'auto:good' }, // Auto quality optimization
          { fetch_format: 'auto' } // Auto format selection (WebP when supported)
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format
          });
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const readableStream = Readable.from(fileBuffer);
    readableStream.pipe(uploadStream);
  });
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('[Cloudinary] Delete error:', error);
    throw error;
  }
}
