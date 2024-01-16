const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user_db_schema');

let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),// Create a new extractor for JWTs in the 'bearer' scheme from the Authorization header
    secretOrKey: 'codeial',

}

passport.use(new JwtStrategy(opts, function(jwtPayload, done){

    User.findById(jwtPayload._id)
    .exec()
    .then(user => {
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
    .catch(err => {
        console.log("Error in finding user from jwt", err);
        return done(err, false);
    });

}));


module.exports = passport;