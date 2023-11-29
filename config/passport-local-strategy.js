const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user_db_schema');

// Authentication using Passport
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async function(email, password, done) {
    try {
        // Find the user and establish the identity
        const user = await User.findOne({ email: email });

        if (!user || user.password !== password) {
            console.log("Invalid username/password");
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        console.log("Error in finding user --> passport", err);
        return done(err);
    }
}));


// Serializing the user to decide which key is to be kept in d cookies

passport.serializeUser(function(user, done){
    done(null, user.id);
});

// Deserializing the user from the key in the cookies

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id).exec();

        if (!user) {
            console.log("User not found");
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        console.log("Error in finding user", err);
        return done(err);
    }
});

// Check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // If the user is signed in then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){ return next();}

    // If the user is not signed in
    return res.redirect('/users/sign-in');
} 

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){ 
        // req.user containes the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;