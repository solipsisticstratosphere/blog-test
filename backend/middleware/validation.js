const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }
  next();
};

const validateEmail = () =>
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email');

const validatePassword = (minLength = 6) =>
  body('password')
    .isLength({ min: minLength })
    .withMessage(`Password must be at least ${minLength} characters`);

const validateUsername = () =>
  body('username')
    .trim()
    .escape()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be 3-50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, hyphens and underscores');

const validatePostTitle = () =>
  body('title')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title max length is 200 characters')
    .matches(/^[^<>]*$/)
    .withMessage('Title contains invalid characters');

const validatePostContent = () =>
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 10000 })
    .withMessage('Content max length is 10000 characters');

const registerValidation = [
  validateUsername(),
  validateEmail(),
  validatePassword(6),
  handleValidationErrors
];

const loginValidation = [
  validateEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const createPostValidation = [
  validatePostTitle(),
  validatePostContent(),
  handleValidationErrors
];

const updatePostValidation = [
  validatePostTitle().optional(),
  validatePostContent().optional(),
  handleValidationErrors
];

const updateUserRoleValidation = [
  body('isAdmin')
    .isBoolean()
    .withMessage('isAdmin must be a boolean'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateEmail,
  validatePassword,
  validateUsername,
  validatePostTitle,
  validatePostContent,
  registerValidation,
  loginValidation,
  createPostValidation,
  updatePostValidation,
  updateUserRoleValidation
};
