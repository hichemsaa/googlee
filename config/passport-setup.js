const passport = require ('passport');
const router = require('express').Router();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require ('../models/user-model');


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id)
    .then(function(user) {
        done(null, user);
      })
    .catch(function(err) {
        done(err);
      });
  });

// Update your google login flow to save the user to your MongoDB database after they log in
passport.use(new GoogleStrategy({
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret,
  callbackURL: '/auth/google/callback'
},
function(accessToken, refreshToken, profile, done) {
    // Find or create the user in your MongoDB database
User.findOne({ googleId: profile.id })
.then(function(user) {
   if (user) { return done(null, user); }

   const newUser = new User({
     googleId: profile.id,
     name: profile.displayName,
     email: profile.emails && profile.emails[0] && profile.emails[0].value,
   });

   return newUser.save()
    .then(function() {
       return done(null, newUser);
     });
 })
.catch(function(err) {
   return done(err);
 });
}));

  // Create a route in your Express app that initiates the google login flow
router.get('/auth/google',
passport.authenticate('google', { scope: ['profile','email'] }));

// Create a route in your Express app that handles the google login callback
router.get('/auth/google/callback',
passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home
  res.redirect('/');
});