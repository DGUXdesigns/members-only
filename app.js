const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
require('./config/passport');
const pgStore = require('connect-pg-simple')(session);
const db = require('./config/db');
const authRouter = require('./routes/authRouter');
const indexRouter = require('./routes/indexRouter');
const passport = require('passport');
const path = require('path');

const port = 3000;
const app = express();

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize session and passport
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new pgStore({
      pool: db,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// session persistence check
app.use((req, res, next) => {
  console.log('Session:', req.session);
  console.log('Authenticated User:', req.user);
  res.locals.user = req.user;
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);

// listen for port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
