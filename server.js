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

// server static public folder
app.use(express.static(__dirname + '/public'));

// parsing
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

//middleware to put infront of protected endpoints
const isLoggedIn = (req, res, next) => {

  console.log("User logged in");
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

// array of players
let players = {};
let playersSpawnLocations = [(800, 800)]

// base url will serve public/index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// url to get to game.html for game start
app.get('/covid_royal', function (req, res) {
  res.sendFile(__dirname + '/public/game.html');
});

//When someone clicks "loging with google" this is the route that begins oauth flow
app.use('/login', authroutes);

//Succesful oauth authentication redirects here, with middleware 'isloggedin' sending a 401 if the user does not have a currently active session.
app.get('/protected.html', isLoggedIn, (req, res)=>{
  res.send(`You have been verified by google oauth ${req.session}`)
});

// socket.io handle for browser connect
io.on('connection', function (socket) {
    console.log('user connected', socket.id);

    // create player
    players[socket.id] = {
      playerId: socket.id,
      playerRisk: 0,
      // currently spawn in middle of map TODO: afte map complete add an array of viable spawn locations in playersSpawnLocations
      x: 400,
      y: 400,
    };

    // send the players object to the new player
    socket.emit('currentPlayers', players);

    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);

    // update player movement
    socket.on('playerMovement', function (movementData) {
      players[socket.id].x = movementData.x;
      players[socket.id].y = movementData.y;
      // emit a message to all players about the player that moved
      socket.broadcast.emit('playerMoved', players[socket.id]);
    });

    // socket event on disconnect
    socket.on('disconnect', function () {
      console.log('user disconnected', socket.id);

      // remove this player from our players object
      delete players[socket.id];
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id);
    });
  });

// server to listen on port 3000
server.listen(8080, function () {
  console.log('Server listening');
});
