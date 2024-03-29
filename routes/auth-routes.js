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
  //There was no session to destroy
  if (!req.session.user) {
    res.redirect("/");
    // res.send({ result:'404' , message: 'No active session' });
    return;
  }

  //DESTROY SESSION AND REDIRECT TO HOME
  await req.logout();
  req.session.destroy();
  res.redirect("/");
  // res.send({ result: 'OK', message: 'Session destroyed' });
  // res.redirect('/')
});

//Callback route for google auth to redirect back too
router.get(
  "/google/redirected",
  passport.authenticate("google", {
    failureRedirect: "/failed",
    session: true,
  }),
  (req, res) => {
    req.session.user = req.user; // Can set whaever u want herea
    res.cookie("mongoID", req.user.id, { maxAge: 1000 * 60 * 60 });
    res.redirect("/");
  }
);

module.exports = router;
