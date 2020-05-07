const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user.id); //we grab the mongoDB ID assigned/created by mongo and shove it into a cookie to be sent to client
});

passport.deserializeUser((id, done) => {
  //Decode client side cookie and find associated user
  console.log("mongodb userid:" + id);
  User.findById(id).then((user) => {
    done(null, user);
  });
});

//Tell passport to use google, with the following configuration options
passport.use(
  new GoogleStrategy(
    {
      //options for the google strat
      callbackURL: "/login/google/redirected",
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("callback executed");
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          console.log(`The user ${currentUser} is already in our DB`);
          done(null, currentUser);
          //This user is in our db
        } else {
          //This user is not in our db, so create it
          new User({
            username: profile.displayName,
            googleId: profile.id,
          })
            //Then add it to our mongoDB
            .save()
            .then((newUser) => {
              console.log("new User created in mongodb: " + newUser);
              done(null, newUser);
            });
        }
        //Not sure if return done(null, profile) is need but too scared to take out
        // return done(null, profile);
      });
    }
  )
);
