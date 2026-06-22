import { body, param, query, validationResult } from 'express-validator';

/**
 * Validation middleware for handling validation errors
 * Returns consistent error responses for validation failures
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }));

    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: formattedErrors,
      requestId: req.id,
    });
  }

  next();
};

/**
 * Validation schemas for authentication endpoints
 */
export const validateRegister = [
  body('username')
    .optional()
    .isString()
    .withMessage('Username must be a string')
    .trim()
    .toLowerCase()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters'),
  body('age')
    .optional()
    .isInt({ min: 18, max: 100 })
    .withMessage('Age must be between 18 and 100')
    .toInt(),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer-not-to-say'])
    .withMessage('Invalid gender value'),
  // Reject other PII fields (but allow email now)
  body('phone').not().exists().withMessage('Phone number is not allowed'),
  body('name').not().exists().withMessage('Name is not allowed'),
  body('realName').not().exists().withMessage('Real name is not allowed'),
  body('firstName').not().exists().withMessage('First name is not allowed'),
  body('lastName').not().exists().withMessage('Last name is not allowed'),
  handleValidationErrors,
];

export const validateLogin = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isString()
    .withMessage('Username must be a string')
    .trim()
    .toLowerCase(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string'),
  handleValidationErrors,
];

/**
 * Validation schemas for post endpoints
 */
export const validateCreatePost = [
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10 and 5000 characters')
    .trim(),
  body('room')
    .notEmpty()
    .withMessage('Room is required')
    .isString()
    .withMessage('Room must be a string')
    .isIn(['dark', 'climb', 'philo'])
    .withMessage('Invalid room type'),
  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters')
    .trim(),
  body('circleId')
    .notEmpty()
    .withMessage('Circle ID is required')
    .isString()
    .withMessage('Circle ID must be a string'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isString()
    .withMessage('Category must be a string')
    .isIn([
      // Dark Room categories
      'CONFESSION', 'REGRET', 'DARK',
      // Climb Room categories
      'IDEA', 'FUTURISTIC', 'BUSINESS', 'ENTREPRENEUR',
      // Philo Room categories
      'SPIRITUAL', 'SHADOW', 'DEEP',
      // Legacy categories
      'LOSS', 'SOLITUDE', 'HOPE', 'FEAR', 'GRIEF', 'ANXIETY', 'LONELINESS'
    ])
    .withMessage('Invalid category'),
  handleValidationErrors,
];

export const validateUpdatePost = [
  param('id').notEmpty().withMessage('Post ID is required').isString(),
  body('content')
    .optional()
    .isString()
    .withMessage('Content must be a string')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10 and 5000 characters')
    .trim(),
  handleValidationErrors,
];

export const validatePostId = [
  param('id')
    .notEmpty()
    .withMessage('Post ID is required')
    .isString()
    .withMessage('Post ID must be a string'),
  handleValidationErrors,
];

export const validateReaction = [
  param('id')
    .notEmpty()
    .withMessage('Post ID is required')
    .isString()
    .withMessage('Post ID must be a string'),
  body('type')
    .notEmpty()
    .withMessage('Reaction type is required')
    .isString()
    .withMessage('Reaction type must be a string')
    .isIn([
      // Dark Room reactions
      'iFeelYou', 'notGood', 'youreNotAlone', 'sendingStrength',
      // Climb Room reactions
      'push', 'pull', 'gear', 'rocket',
      // Philo Room reactions
      'lamp', 'spark', 'clap',
      // Legacy reactions
      'iRelate', 'imListening', 'theAbyss'
    ])
    .withMessage('Invalid reaction type'),
  handleValidationErrors,
];

export const validateCommentReaction = [
  param('commentId')
    .notEmpty()
    .withMessage('Comment ID is required')
    .isString()
    .withMessage('Comment ID must be a string'),
  body('type')
    .notEmpty()
    .withMessage('Reaction type is required')
    .isString()
    .withMessage('Reaction type must be a string')
    .isIn(['resonate', 'echo'])
    .withMessage('Invalid reaction type. Must be "resonate" or "echo"'),
  handleValidationErrors,
];

/**
 * Validation schemas for circle endpoints
 */
export const validateCreateCircle = [
  body('name')
    .notEmpty()
    .withMessage('Circle name is required')
    .isString()
    .withMessage('Circle name must be a string')
    .isLength({ min: 3, max: 100 })
    .withMessage('Circle name must be between 3 and 100 characters')
    .trim(),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters')
    .trim(),
  body('visibility')
    .optional()
    .isIn(['public', 'restricted'])
    .withMessage('Visibility must be either public or restricted'),
  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array'),
  handleValidationErrors,
];

export const validateCircleId = [
  param('id')
    .notEmpty()
    .withMessage('Circle ID is required')
    .isString()
    .withMessage('Circle ID must be a string'),
  handleValidationErrors,
];

export const validateSearchCircles = [
  query('q')
    .optional()
    .isString()
    .withMessage('Search query must be a string')
    .isLength({ max: 200 })
    .withMessage('Search query must not exceed 200 characters')
    .trim(),
  query('cursor')
    .optional()
    .isString()
    .withMessage('Cursor must be a string'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
    .toInt(),
  handleValidationErrors,
];

/**
 * Validation schemas for comment endpoints
 */
export const validateCreateComment = [
  param('postId')
    .notEmpty()
    .withMessage('Post ID is required')
    .isString()
    .withMessage('Post ID must be a string'),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 1000 characters')
    .trim(),
  handleValidationErrors,
];

export const validateCreateReply = [
  param('commentId')
    .notEmpty()
    .withMessage('Comment ID is required')
    .isString()
    .withMessage('Comment ID must be a string'),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 1000 characters')
    .trim(),
  handleValidationErrors,
];

export const validateCommentId = [
  param('id')
    .notEmpty()
    .withMessage('Comment ID is required')
    .isString()
    .withMessage('Comment ID must be a string'),
  handleValidationErrors,
];

export const validateCreateCircleComment = [
  param('circleId')
    .notEmpty()
    .withMessage('Circle ID is required')
    .isString()
    .withMessage('Circle ID must be a string'),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 1000 characters')
    .trim(),
  handleValidationErrors,
];

/**
 * Validation schemas for user endpoints
 */
export const validateUpdateUser = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('age')
    .optional()
    .isInt({ min: 18, max: 100 })
    .withMessage('Age must be between 18 and 100')
    .toInt(),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer-not-to-say'])
    .withMessage('Invalid gender value'),
  // Reject other PII fields (but allow email now)
  body('phone').not().exists().withMessage('Phone number is not allowed'),
  body('name').not().exists().withMessage('Name is not allowed'),
  body('realName').not().exists().withMessage('Real name is not allowed'),
  body('firstName').not().exists().withMessage('First name is not allowed'),
  body('lastName').not().exists().withMessage('Last name is not allowed'),
  handleValidationErrors,
];

/**
 * Validation schemas for pagination
 */
export const validatePagination = [
  query('cursor')
    .optional()
    .isString()
    .withMessage('Cursor must be a string'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
    .toInt(),
  handleValidationErrors,
];

/**
 * Validation schemas for category endpoints
 */
export const validateCategoryName = [
  param('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isString()
    .withMessage('Category name must be a string')
    .isIn(['life', 'thoughts', 'questions', 'stories', 'advice', 'other'])
    .withMessage('Invalid category'),
  handleValidationErrors,
];
