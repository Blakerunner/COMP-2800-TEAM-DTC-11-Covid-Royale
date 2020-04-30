const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");


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
    //   console.log(accessToken);
      return done(null, profile);
    }));