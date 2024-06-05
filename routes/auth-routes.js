const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});
// Create a route in your Express app that initiates the google login flow
router.get('/google',
passport.authenticate('google', { scope: ['profile','email'] }));
  
// Create a route in your Express app that handles the google login callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
    // Successful authentication, redirect home
        res.redirect('/profile');
});
router.get('/logout', (req, res, next) => {
    req.logout((error)=>{
        if (error) {return next(error)}
        res.redirect('/')
    });  
});
module.exports = router;
