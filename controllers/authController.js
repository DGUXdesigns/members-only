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

function showJoinClubForm(req, res) {
  res.render('auth/join-club', {
    title: 'Join The Club',
    errors: null,
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

async function postJoinClub(req, res) {
  const SECRET_PASSCODE = process.env.SECRET_PASSCODE;
  const title = 'Join The Club';
  const { passcode } = req.body;

  if (req.user.is_member === true) {
    return res.render('auth/join-club', {
      title: title,
      error: `You're already part of the club!`,
    });
  }

  if (passcode !== SECRET_PASSCODE) {
    return res.render('auth/join-club', {
      title: title,
      error: 'Incorrect passcode! Try again',
    });
  }

  try {
    if (!req.user) {
      return res.redirect('/login');
    }

    await User.updateMembership(req.user.id);

    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.status(500).send('something went wrong.');
  }
}

module.exports = {
  createUser,
  showSignUpForm,
  showLoginForm,
  showJoinClubForm,
  loginUser,
  postJoinClub,
};
