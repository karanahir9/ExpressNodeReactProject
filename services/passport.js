const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const passport = require('passport');
const mongoose = require('mongoose')


const User = mongoose.model('users');



passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id }).then( existingUser =>{
            if(existingUser){
                //We have the profile ID in our DB already
            }else{
                //create a new record with the Profile Id as we don't have the user record
                new User({ googleId: profile.id }).save();
            }
        });

    })
);
