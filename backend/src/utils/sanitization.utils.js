import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

/**
 * HTML Sanitization Utilities
 * Uses DOMPurify to remove malicious HTML/scripts from user content
 * Prevents XSS attacks while allowing safe formatting
 */

// Create a JSDOM window for DOMPurify (required for Node.js environment)
const window = new JSDOM('').window;
const purify = DOMPurify(window);

/**
 * Configure DOMPurify with allowed tags and attributes
 * Very restrictive - only allows basic text formatting
 */
const SANITIZATION_CONFIG = {
  // Allowed HTML tags
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's', 'blockquote',
    'ul', 'ol', 'li', 'a', 'code', 'pre'
  ],
  
  // Allowed attributes per tag
  ALLOWED_ATTR: ['href', 'title'],
  
  // Allowed URI schemes for links
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):)/i,
  
  // Keep content of removed tags
  KEEP_CONTENT: true,
  
  // Return a string (not DOM nodes)
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  
  // Additional security options
  SAFE_FOR_TEMPLATES: true,
  WHOLE_DOCUMENT: false,
  FORCE_BODY: false,
  
  // Remove data attributes
  ALLOW_DATA_ATTR: false,
  
  // Remove unknown protocols
  ALLOW_UNKNOWN_PROTOCOLS: false
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes dangerous tags, scripts, and attributes
 * @param {string} content - Raw HTML content from user
 * @returns {string} Sanitized HTML content
 */
export function sanitizeHtml(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  // Trim whitespace
  const trimmed = content.trim();
  
  if (trimmed.length === 0) {
    return '';
  }
  
  // Sanitize with DOMPurify
  const sanitized = purify.sanitize(trimmed, SANITIZATION_CONFIG);
  
  return sanitized;
}

/**
 * Sanitize plain text content
 * Escapes HTML entities to prevent injection
 * @param {string} content - Plain text content
 * @returns {string} Escaped text
 */
export function sanitizePlainText(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  return content
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize post content
 * Allows basic HTML formatting for multi-paragraph posts
 * @param {string} content - Post content
 * @returns {string} Sanitized content
 */
export function sanitizePostContent(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  // First sanitize HTML
  let sanitized = sanitizeHtml(content);
  
  // Convert multiple newlines to paragraph breaks
  sanitized = sanitized.replace(/\n\n+/g, '</p><p>');
  
  // Wrap in paragraph tags if not already wrapped
  if (!sanitized.startsWith('<p>')) {
    sanitized = `<p>${sanitized}</p>`;
  }
  
  return sanitized;
}

/**
 * Sanitize comment content
 * More restrictive than posts - only allows basic inline formatting
 * @param {string} content - Comment content
 * @returns {string} Sanitized content
 */
export function sanitizeCommentContent(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  // Use more restrictive config for comments
  const commentConfig = {
    ...SANITIZATION_CONFIG,
    ALLOWED_TAGS: ['strong', 'em', 'u', 's', 'code', 'a', 'br'],
    ALLOWED_ATTR: ['href']
  };
  
  const trimmed = content.trim();
  
  if (trimmed.length === 0) {
    return '';
  }
  
  return purify.sanitize(trimmed, commentConfig);
}

/**
 * Strip all HTML tags from content
 * Returns plain text only
 * @param {string} content - HTML content
 * @returns {string} Plain text
 */
export function stripHtmlTags(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  // Use DOMPurify to strip all tags
  const stripped = purify.sanitize(content, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true
  });
  
  return stripped.trim();
}

/**
 * Validate that content doesn't contain dangerous patterns
 * Additional layer of defense beyond DOMPurify
 * @param {string} content - Content to validate
 * @returns {boolean} True if content appears safe
 */
export function validateContentSafety(content) {
  if (!content || typeof content !== 'string') {
    return true;
  }
  
  // Check for common XSS patterns (defense in depth)
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<applet/i,
    /<meta/i,
    /<link/i,
    /<style/i,
    /vbscript:/i,
    /data:text\/html/i
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(content)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Sanitize and validate content in one step
 * Returns sanitized content or throws error if validation fails
 * @param {string} content - Raw content
 * @param {string} type - Content type ('post' or 'comment')
 * @returns {string} Sanitized content
 * @throws {Error} If content contains dangerous patterns
 */
export function sanitizeAndValidate(content, type = 'post') {
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  // First check for dangerous patterns
  if (!validateContentSafety(content)) {
    throw new Error('Content contains potentially dangerous patterns');
  }
  
  // Then sanitize based on type
  if (type === 'comment') {
    return sanitizeCommentContent(content);
  }
  
  return sanitizePostContent(content);
}

/**
 * Get sanitization statistics
 * Useful for logging and monitoring
 * @param {string} original - Original content
 * @param {string} sanitized - Sanitized content
 * @returns {Object} Statistics about what was removed
 */
export function getSanitizationStats(original, sanitized) {
  const originalLength = original?.length || 0;
  const sanitizedLength = sanitized?.length || 0;
  const removed = originalLength - sanitizedLength;
  const percentRemoved = originalLength > 0 
    ? ((removed / originalLength) * 100).toFixed(2)
    : 0;
  
  return {
    originalLength,
    sanitizedLength,
    bytesRemoved: removed,
    percentRemoved: parseFloat(percentRemoved),
    wasModified: original !== sanitized
  };
}
