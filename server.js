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
  { useNewUrlParser: true, useUnifiedTopology: true },
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

    //BLAKE THIS ENDPOINT RESPONDS WITH AN ARRAY OF 10 USER OBJECTS
    //SORTED BY HIghSCORE 
    app.get('/highscore', function (req, res){
      User.find({highScore: {$exists: true}})
      .sort('-highScore')
      .limit(10)
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
    let playersSpawnLocations = [[400, 400]];

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

    function helper(socket) {
      let cookies = socket.request.headers.cookie.split(" ");
      let key_val = cookies[cookies.length - 1];
      username = key_val.split("=");
      if (username[0].includes("username")) {
        username = username[1].replace("%20", " ");
        return username;
      } else {
        return false;
      }
      username = username[1].replace("%20", " ");
    }

    function helper2(socket) {
      let mongoID;
      let cookies = socket.request.headers.cookie.split(" ");
      for (cookie of cookies) {
        if (cookie.includes("mongoID")) {
          //Seperate key from val
          let temp = cookie.split("=")[1];
          //Remove semicolon
          temp = temp.slice(0, -1);
          return temp;
        }
      }
    }

    // socket.io handle for browser connect
    io.on("connection", function (socket) {
      //HOLY FUCK THIS IS FUCKING IT
      //EVERYTHING STORED IN MONGO (WHICH IS EVERYTHING THAT GETS SERIALIZED BY PASSPORT)
      //IS ACCESIBLE UNDER SOCKET.REQUEST.USER
      console.log("MARKER EASILY SEARCHABLE STRING", socket.request.user);

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
        x: playersSpawnLocations[0][0],
        y: playersSpawnLocations[0][1],
      };

      // console.log(players, "PLAYER VARIABLE");
      

      // emit map blueprint
      socket.on("mapBlueprintReady", () => {
        socket.emit("mapBlueprint", mapData);
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

      // socket event on disconnect
      socket.on("disconnect", function (players) {
        let mongoID = socket.request.user.id;
        
        // User.findByIdAndUpdate(mongoID, {username: "gobble"})
        //   .then(user => console.log)

        console.log("user disconnected", socket.id);
        // remove this player from our players object
        delete players[socket.id];
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

     //Before we reset player data, update anything in the db that needs to be updated
      console.log("pre-player-reset:", players);
      //Loop through current players
      Object.keys(players).forEach(function (player) {
        
        //Get the users current highscore
        //MAKE SURE PLAYER VALS GET UPDATED BEFORE THIS 

        
        User.findById(players[player].playerMongoID)
          .then(user => {
            console.log("Database Highscore is", user.highScore)
            console.log("player hgighscore is", players[player].playerScore)
            if(players[player].playerScore > user.highScore){
              //Change HighScore here if its greater than database highscore
               User.findByIdAndUpdate(mongoID, {highScore: player.highScore})
                  .then(user => console.log(`Updated highscore of user', ${user.username} from ${user.highScore} to ${player.highScore}`))
            }
          })
        // console.log(players[player], "GOBBLED");
      })

 // reset player data on server to new game round standards

      Object.keys(players).forEach(function (player) {
        players[player].playerRisk = 0;
        players[player].playerScore = 0;
        players[player].playerCovidPos = false;
        players[player].x = playersSpawnLocations[0][0];
        players[player].y = playersSpawnLocations[0][1];
        players[player].mapBlueprint = mapData;
        console.log(players[player].playerName, " reset");
      });

      console.log("server broadcast | serverGameStart");
    }

    // Time for each game round in ms
    let gameRoundInterval = 60000
    // Interval for calling gameReset
    setInterval(() => {
      gameReset(io, players);
    }, gameRoundInterval);

    // server to listen on port 8080
    server.listen(8080, function () {
      console.log("Server listening");
    });
  }
);
