const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { body, validationResult } = require('express-validator');

let User = require('../models/user');

// Home Page - Dashboard
router.get('/', ensureAuthenticated, (req, res, next) => {
  res.render('index', { username: req.user.username });
});

// Login Form
router.get('/login', (req, res, next) => {
  res.render('login', { layout: 'empty', title: 'Login' });
});

// Register Form
router.get('/register', (req, res, next) => {
  res.render('register', { layout:'empty', title: 'Register' });
});

// Logout
router.get('/logout', (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

// Process Register
router.post('/register', [
  body('name', 'Name field is required.').notEmpty(),
  body('email', 'Email field is required.').notEmpty(),
  body('email', 'Email field must be a valid email.').isEmail(),
  body('name', 'Name field is required.').notEmpty(),
  body('username', 'Username field is required').notEmpty(),
  body('password', 'Password field is required').notEmpty(),
], (req, res, next) => {
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('register', {
      errors: errors
    });
  }
  else {
    const newUser = new User({
      name: name,
      username: username,
      email: email,
      password: password
    });

    User.registerUser(newUser, (err, user) => {
      if(err) throw err;
      req.flash('success_msg', 'You are registered and can log in');
      res.redirect('/login');
    });
  }
});

// Local Strategy
passport.use(new LocalStrategy((username, password, done) => {
  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'No user found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message: 'Wrong Password'});
      }
    });
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

// Login Processing
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash: true
  })(req, res, next);
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'You are not authorized to view that page');
    res.redirect('/login');
  }
}

module.exports = router;
