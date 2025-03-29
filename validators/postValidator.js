const { body } = require('express-validator');

const postValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required')
    .customSanitizer((value) => {
      if (value && typeof value === 'string') {
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      }
      return value;
    }),

  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Post content must be between 1 and 2000 characters.'),
];

module.exports = postValidation;
