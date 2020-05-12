//Instantiate router object
const router = require("express").Router();
const passport = require("passport");

//auth login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"], //Scope is basically this stuff we want from the users google account
  })
);

//auth logout
//First detroy passport sesssion thant redirect home
router.get("/logout", async (req, res) => {
  await req.logout();
  req.session = null;
  //req.session.destroy();
  res.redirect("/");
});

//Callback route for google auth to redirect back too
router.get(
  "/google/redirected",
  passport.authenticate("google", { failureRedirect: "/failed", session: true }),
  (req, res) => {
    req.session.user = req.user; // Can set whaever u want herea
    console.log('This is pretty much the only time we have access to the user', req.user);
    res.cookie('mongoID', req.user.id, { maxAge: 1000 * 60 * 60});
    res.redirect('/covid_royal');
  }
);

module.exports = router;
