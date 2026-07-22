import cloudinary from '../config/cloudinary.config.js';
import { Readable } from 'stream';

/**
 * Cloudinary Service
 * Handles image uploads to Cloudinary
 */

/**
 * Upload image to Cloudinary with smart widescreen conversion
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
          // Step 1: Limit max size to 1200px while preserving aspect ratio
          { width: 1200, height: 1200, crop: 'limit' },
          
          // Step 2: Convert to widescreen 16:9 format with smart padding
          { 
            width: 1200, 
            height: 675,  // 16:9 ratio (1200/675 = 1.78)
            crop: 'pad',  // Adds padding without distortion
            background: 'auto:predominant_gradient',  // Smart blur background from image colors
            gravity: 'center'  // Center the original image
          },
          
          // Step 3: Quality and format optimization
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
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
