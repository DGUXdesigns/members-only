const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./db');
const User = require('../models/User');

const customFields = {
  usernameField: 'email',
  passwordField: 'password',
};

const strategy = new LocalStrategy(
  customFields,
  async (email, password, done) => {
    try {
      const user = await User.find(email);

      if (!user) {
        return done(null, false, { message: 'Invalid email' });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  },
);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);

    if (!rows[0]) {
      return done(null, false);
    }

    done(null, rows[0]);
  } catch (error) {
    done(error);
  }
});
