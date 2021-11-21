const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/user-model");
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

const GOOGLE_CLIENT_ID = process.env.clientID;
const GOOGLE_CLIENT_SECRET = process.env.clientSecret;
const GOOGLE_CALLBACK_URL = process.env.callbackUrl;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("callback executed");
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // console.log(`The user ${currentUser} is already in our DB`);
          done(null, currentUser);
          //This user is in our db
        } else {
          //This user is not in our db, so create it
          new User({
            username: profile.displayName,
            googleId: profile.id,
            highScore: 0,
          })
            //Then add it to our mongoDB
            .save()
            .then((newUser) => {
              console.log(
                "(FROM PASSPORT-SETUP google stragey user)" + newUser
              );
              done(null, newUser);
            });
        }
        //Not sure if return done(null, profile) is need but too scared to take out
        // return done(null, profile);
      });
    }
  )
);
