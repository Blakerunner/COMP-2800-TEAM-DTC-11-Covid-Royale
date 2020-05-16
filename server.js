const express = require("express");
const app = express();
const server = require("http").Server(app);
// const io = require("socket.io").listen(server);
const authroutes = require("./routes/auth-routes");
const passportSetup = require("./config/passport-setup");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/user-model.js");
const MongoStore = require("connect-mongo")(session);
const sessionStore = new MongoStore({
  url:
    "mongodb+srv://root:covid_royale69@covidroyale-jk2bl.mongodb.net/test?retryWrites=true&w=majority",
});
const cookieParser = require("cookie-parser");

const expressSession = session({
  store: sessionStore,
  key: "GOBBLE",
  secret: process.env.cookieKey,
  cookie: {
    maxAge: 1000 * 60 * 60,
  },
  saveUninitialized: false,
});
app.use(cors());
app.use(passport.initialize());



app.use(expressSession)
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var io               = require("socket.io")(server),
    passportSocketIo = require("passport.socketio");

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,       // the same middleware you registrer in express
  key:          'GOBBLE',       // the name of the cookie where express/connect stores its session_id
  secret:       process.env.cookieKey,    // the session_secret to parse the cookie
  store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
  success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
  fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
}));
 
function onAuthorizeSuccess(data, accept){
  console.log(' (FROM onAuthorizeSucess of server.js) successful connection to socket.io');

  // The accept-callback still allows us to decide whether to
  // accept the connection or not.
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
  if (error) throw new Error(message);
  console.log(
    "(FROM onAuthorizeFail of server.js failed connection to socket.io:",
    message
  );

  // We use this callback to log all of our failed connections.
  accept(null, false);

  // OR

  // If you use socket.io@1.X the callback looks different
  // If you don't want to accept the connection
  if (error) accept(new Error(message));
  // this error will be sent to the user as a special error-package
  // see: http://socket.io/docs/client-api/#socket > error-object
}


//initialize passport

//Connect to mognodb
mongoose.connect(
  process.env.mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  function () {
    console.log("Connected to mongoDB");

    // middleware to put infront of protected endpoints
    // BROKEN durring overhaul
    //YOU
    const isLoggedIn = (req, res, next) => {
      console.log("from isloggedin", req.session);
      if (req.session.user) {
        next();
      } else {
        console.log(
          " from inside isLoggedin No authenticated passport user found"
        );
        res.redirect("login/google");
      }
    };

    // base url will serve public/index.html
    app.get("/", function (req, res) {
      res.sendFile(__dirname + "/index.html");
    });

    app.get("/whoami", cors(), function (req, res) {
      res.header("Access-Control-Allow-Origin", "*");
      res.json(req.session);
    });

    //BLAKE THIS ENDPOINT RESPONDS WITH AN ARRAY OF 5 USER OBJECTS
    //SORTED BY HIghSCORE 
    app.get('/highscore', function (req, res){
      User.find({highScore: {$exists: true}})
      .sort('-highScore')
      .limit(5)
      .exec(function(err, userArray) {
        res.json(userArray);
      });
    });

    // url to get to game.html for game start
    app.get("/covid_royal", isLoggedIn, function (req, res) {
      res.sendFile(__dirname + "/public/game.html");
    });

    //When someone clicks "loging with google" this is the route that begins oauth flow
    app.use("/login", authroutes);

    //Succesful oauth authentication redirects here, with middleware 'isloggedin' sending a 401 if the user does not have a currently active session.
    app.get("/protected.html", isLoggedIn, (req, res) => {
      // res.cookie('username', req.session.passport.user.username, { maxAge: 9000});
      res.redirect("/covid_royal");
    });

    //Endpoint To delete My account
    app.get('/deleteAccount', (req, res) => {
      if(!req.session.passport){
        res.send("Cannot delete account because you are not logged in")
        return;
      }
      let mongoID = req.session.passport.user;
      User.findOneAndDelete(req.session.user.id)
        .then(result => {
          res.redirect('login/logout')
          // res.send(`Sucesfully deleted user ${req.session.user.username}`);
        })
        .catch(err => res.send('An error occured deleting your account: ', err))
      
    })

    // array of players
    let players = {};
    let playersSpawnLocations = [];
    let spawnLocationCounter = 0

    // generate spawn locations
    let numOfChunksSpawnOn = 9
    let openLocations = [[56, 152], [408, 376], [472, 152]]
    let tileOffset = [[80, 80], [560, 80], [1040, 80], [80, 560], [560, 560], [1040, 560], [80, 1040], [560, 1040], [1040, 1040]]
    for (let i = 0; i < openLocations.length; i++) {
      for (let j = 0; j < numOfChunksSpawnOn; j++) {
        playersSpawnLocations.push([tileOffset[j][0] + openLocations[i][0], tileOffset[j][1] + openLocations[i][1]])
      }
    }

    // grab a spawn location from the list of potential locations, increment spawn counter
    function getPlayerSpawnLocation() {
      if (spawnLocationCounter >= playersSpawnLocations.length) {
        spawnLocationCounter = 0
      }
      spawnLocationCounter++
      return playersSpawnLocations[spawnLocationCounter]
    }

    // number of server restarts
    let serverRestartNumber = 0;

    // generate map blueprint, random array of ints
    let mapData = generateMapBluprint();
    function generateMapBluprint() {
      let numberOfChunks = 9;
      let randomNumbers = [];
      for (let n = [...Array(numberOfChunks).keys()], i = n.length; i--; ) {
        randomNumbers.push(n.splice(Math.floor(Math.random() * (i + 1)), 1)[0]);
      }
      return randomNumbers;
    }

    // socket.io handle for browser connect
    io.on("connection", function (socket) {
      //HOLY FUCK THIS IS FUCKING IT
      //EVERYTHING STORED IN MONGO (WHICH IS EVERYTHING THAT GETS SERIALIZED BY PASSPORT)
      //IS ACCESIBLE UNDER SOCKET.REQUEST.USER
      console.log("MARKER EASILY SEARCHABLE STRING", socket.request.user);

      // get player spawn location
      let thisSocketSpawn = getPlayerSpawnLocation()

      players[socket.id] = {
        playerMongoID: socket.request.user.id,
        playerId: socket.id,
        playerRisk: 0,
        playerScore: 0,
        playerCovidPos: false,
        playerDir: "stand",
        playerName: socket.request.user.username,
        mapBlueprint: mapData,
        // playerName: COOKIE ? username : "Homonucleus",
        // currently spawn in middle of map TODO: afte map complete add an array of viable spawn locations in playersSpawnLocations
        x: thisSocketSpawn[0],
        y: thisSocketSpawn[1],
      };

      // console.log(players, "PLAYER VARIABLE");

      // update server with player final data
      socket.on("playerStatsUpdate", function(player) {
        console.log("Updating player End Game Scores | ", players[socket.id].playerName)
        players[socket.id].playerScore = player.score
        players[socket.id].playerCovidPos = player.covid
      });

      // send the players object to the new player
      socket.emit("currentPlayers", players);

      // update all other players of the new player
      socket.broadcast.emit("newPlayer", players[socket.id]);

      // update player movement
      socket.on("playerMovement", function (movementData) {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        players[socket.id].playerDir = movementData.playerDir;
        // emit a message to all players about the player that moved
        socket.broadcast.emit("playerMoved", players[socket.id]);
      });

      // // remove player on end of round
      // socket.on("endRoundRemoveMe", function(players) {
      //   console.log("End Round removing | ", socket.id, players[socket.id].username)
      //   delete players[socket.id]
      // })

      // socket event on disconnect
      socket.on("disconnect", function () {
        let mongoID = socket.request.user.id;
        
        // User.findByIdAndUpdate(mongoID, {username: "gobble"})
        //   .then(user => console.log)

        console.log("user disconnected | delete", players[socket.id]);
        // remove this player from our players object
        delete players[socket.id];
        console.log("user disconnected | delete | should be null", players[socket.id])
        // emit a message to all players to remove this player
        io.emit("disconnect", socket.id);
      });
    });

    // Game Round Reset
    function gameReset(io, players) {
      // reset number tracking
      serverRestartNumber++;
      console.log("Server restart now | Number: ", serverRestartNumber);

      // update server with player infomation

      // let clients know that game has ended
      io.emit("serverGameEnd");

      // generate new map seed
      mapData = generateMapBluprint();

      // Wait time buffer for all browsers to update player info
      setTimeout( () => {

        //Loop through current players
      Object.keys(players).forEach(function (player) {
        
        //Get the users current highscore
        //MAKE SURE PLAYER VALS GET UPDATED BEFORE THIS
        
        User.findById(players[player].playerMongoID)
          .then(user => {
            console.log("Player DB highScore is: ", user.highScore)
            console.log("Player Round playerScore is: ", players[player].playerScore)
            if(players[player].playerScore > user.highScore){
              //Change HighScore here if its greater than database highscore
              console.log("USER LOG ---------------------- ", user.id)
               User.findByIdAndUpdate(user.id, {highScore: players[player].playerScore})
                  .then(user => {
                      console.log(`Updated highscore of user', ${user.username} from ${user.highScore} to ${players[player].playerScore}`)
                  })
            }
          })
        // console.log(players[player], "GOBBLED");
      })

      console.log("===============================================================================")
      console.log("Server | players post reset", players)
        
      }, 1000);

    }

    // Time for each game round in ms
    let gameRoundInterval = 120000
    // Interval for calling gameReset
    setInterval(() => {
      gameReset(io, players);
    }, gameRoundInterval);


    // socket garbage collection, kill socket on round reset


    // server to listen on port 8080
    server.listen(8080, function () {
      console.log("Server listening");
    });
  }
);
