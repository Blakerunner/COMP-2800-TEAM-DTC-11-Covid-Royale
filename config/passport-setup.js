const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require('../models/user-model');


passport.serializeUser((profile, done) => {
    done(null, profile.displayName);
});

passport.deserializeUser((displayName, done) => {
     console.log(displayName);

    //IF user is in our db
    return done(null, profile);
});

//Tell passport to use google, with the following configuration options
passport.use(
  new GoogleStrategy({
    //options for the google strat
    callbackURL: '/login/google/redirected',
    clientID: '549252846549-foksnnm2n4g0p0fvnihc8i6vufv31l9p.apps.googleusercontent.com',
    clientSecret: 'w3uP58Th-pJsdoPhbBiuorsX'
  }, (accessToken, refreshToken, profile, done) => {
    //   console.log('callback executed');
    //   console.log("Name: ", profile.displayName);
    //   console.log(accessToken)
      //
      ////First check if user in db before creating new one
      User.findOne({googleId:profile.id}).then((currentUser) => {
      if(currentUser){
      //This user is in our db}
      }
          else{
          //create the user}
          
    new User({
        username: profile.displayName
        googleId: profile.id
    }).save().then((newUser) => {
    console.log('new User created in mongodb: ' + newUser)
    });
        //Not sure if return done(null, profile) is need but too scared to take out
      return done(null, profile);
    }));
