const authRouter = require('express').Router();
const authController = require('../controllers/authController');
const {
  signUpValidation,
  loginValidation,
} = require('../validators/authValidator');

// Sign up
authRouter.get('/register', authController.showSignUpForm);
authRouter.post('/register', signUpValidation, authController.createUser);

// Login
authRouter.get('/login', authController.showLoginForm);
authRouter.post('/login', loginValidation, authController.loginUser);

// Activate membership
authRouter.get('/join-club', authController.showJoinClubForm);
authRouter.post('/join-club', authController.postJoinClub);

module.exports = authRouter;
