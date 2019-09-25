const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');

const app = express();

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, email, done) => {
        console.log('Access Token: ',accessToken);
        console.log('Refresh TOken: ',refreshToken);
        console.log('Email: ',email);
    })
);

app.get('/auth/google',
        passport.authenticate('google',{
        scope: ['profile','email']
    })
);

app.get('/auth/google/callback' , passport.authenticate('google'));

app.get('/', (req , res) =>{
    res.send({ hi: 'there'});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);