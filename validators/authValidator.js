const { body } = require('express-validator');
const User = require('../models/User');

const alphaErr = 'Must only contain letters.';
const lengthErr = 'Must be between 1 and 20 characters';

const signUpValidation = [
  body('firstName')
    .trim()
    .customSanitizer((value) => {
      if (value && typeof value === 'string') {
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      }
      return value;
    })
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 20 })
    .withMessage(`First name ${lengthErr}`),

  body('lastName')
    .trim()
    .customSanitizer((value) => {
      if (value && typeof value === 'string') {
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      }
      return value;
    })
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 20 })
    .withMessage(`Last name ${lengthErr}`),

  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Not a valid email address')
    .custom(async (value) => {
      const existingUser = await User.findByEmail(value);
      if (existingUser) {
        throw new Error('A user already exists with this email');
      }
    }),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be atleast 6 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),

  body('passwordConfirmation')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords must match');
      }
      return true;
    })
    .notEmpty()
    .withMessage('Please confirm your password'),
];

const loginValidation = [
  body('email').trim().normalizeEmail().isEmail().withMessage('Invalid email'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

module.exports = {
  signUpValidation,
  loginValidation,
};
