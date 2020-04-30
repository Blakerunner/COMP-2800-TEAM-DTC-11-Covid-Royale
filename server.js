const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require("socket.io").listen(server);
const authroutes = require('./routes/auth-routes');
const passportSetup = require('./config/passport-setup');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cors = require('cors');
const bodyParser = require('body-parser');




app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//initialize passport
app.use(passport.initialize());

//Cookies for session storage
app.use(cookieSession({
  maxAge:24*60*60*1000,
  keys: ["MySecretCookieKey"]
}));

// server static public folder
app.use(express.static(__dirname + '/public'));


//middleware to put infront of protected endpoints
const isLoggedIn = (req, res, next) => {

  console.log("Cocks n dix");
  // console.log(req.user);
  // console.log(req.session.passport);
  
  if (req.session.passport) {
      next();
  } else {
    console.log("No authenticated passport user found");
      res.sendStatus(401);
  }
}




//Put ^ middleware infront of authenticated endpoint


//When someone clicks "loging with google" this is the route that begins oauth flow
app.use('/login', authroutes);

// base url will serve public/index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


//Succesful oauth authentication redirects here, with middleware 'isloggedin' sending a 401 if the user does not have a currently active session.
app.get('/protected.html', isLoggedIn, (req, res)=>{
  res.sendFile(__dirname + "/protected.html")
});

// socket.io handle for browser connect
io.on('connection', function (socket) {
    console.log('user connected');

    // socket event on disconnect
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });

// server to listen on port 3000
server.listen(3000, function () {
  console.log('Server listening');
});