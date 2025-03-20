const { validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../models/User');

function showSignUpForm(req, res) {
  res.render('auth/register', {
    title: 'Sign Up',
    errors: {},
    oldInput: {},
  });
}

function showLoginForm(req, res) {
  res.render('auth/login', {
    title: 'Login',
    errors: {},
    oldInput: {},
  });
}

async function createUser(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMap = {};

    errors.array().forEach((error) => {
      errorMap[error.path] = error.msg;
    });

    return res.status(400).render('auth/register', {
      title: 'Sign Up',
      errors: errorMap,
      oldInput: req.body, // Preserve input fields
    });
  }

  try {
    const { firstName, lastName, email, password } = req.body;
    await User.create(firstName, lastName, email, password);

    res.redirect('/auth/login');
  } catch (error) {
    next(error);
  }
}

async function loginUser(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMap = {};
    errors.array().forEach((error) => {
      errorMap[error.path] = error.msg;
    });

    return res.status(400).render('auth/login', {
      title: 'Login',
      errors: errorMap,
      oldInput: req.body,
    });
  }

  return passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
  })(req, res, next);
}

module.exports = {
  createUser,
  showSignUpForm,
  showLoginForm,
  loginUser,
};
