const express = require("express");
const app = express();
const server = require("http").Server(app);
const authroutes = require("./routes/auth-routes");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user-model.js");
const MongoStore = require("connect-mongo")(session);
const io = require("socket.io")(server);

require("dotenv").config();
const PORT = process.env.PORT | 8080;

const sessionStore = new MongoStore({
  url: process.env.mongoURI,
});

const expressSession = session({
  resave: true,
  saveUninitialized: true,
  store: sessionStore,
  secret: process.env.cookieKey,
  cookie: {
    maxAge: 1000 * 60 * 60,
  },
  unset: "destroy",
});

app.use(cors());
app.use(passport.initialize());

app.use(expressSession);
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(expressSession));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("unauthorized"));
  }
});

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
      if (!req.session.user) {
        res.json({ user: null });
        return;
      }
      User.findById(req.session.user._id).then((user) => {
        res.json(user);
      });
    });
    //BLAKE THIS ENDPOINT RESPONDS WITH AN ARRAY OF 5 USER OBJECTS
    //SORTED BY HIghSCORE
    app.get("/highscore", function (req, res) {
      User.find({ highScore: { $exists: true } })
        .sort("-highScore")
        .limit(10)
        .exec(function (err, userArray) {
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
    app.get("/deleteAccount", (req, res) => {
      if (!req.session.passport) {
        res.send("Cannot delete account because you are not logged in");
        return;
      }
      let mongoID = req.session.passport.user;
      User.findOneAndDelete(req.session.user._id)
        .then((result) => {
          res.redirect("login/logout");
          // res.send(`Sucesfully deleted user ${req.session.user.username}`);
        })
        .catch((err) =>
          res.send("An error occured deleting your account: ", err)
        );
    });

    // array of players
    let players = {};
    let playersSpawnLocations = [];
    let spawnLocationCounter = 0;

    // generate spawn locations
    let numOfChunksSpawnOn = 9;
    let openLocations = [
      [56, 152],
      [408, 376],
      [472, 152],
    ];
    let tileOffset = [
      [80, 80],
      [560, 80],
      [1040, 80],
      [80, 560],
      [560, 560],
      [1040, 560],
      [80, 1040],
      [560, 1040],
      [1040, 1040],
    ];
    for (let i = 0; i < openLocations.length; i++) {
      for (let j = 0; j < numOfChunksSpawnOn; j++) {
        playersSpawnLocations.push([
          tileOffset[j][0] + openLocations[i][0],
          tileOffset[j][1] + openLocations[i][1],
        ]);
      }
    }

    // grab a spawn location from the list of potential locations, increment spawn counter
    function getPlayerSpawnLocation() {
      if (spawnLocationCounter >= playersSpawnLocations.length) {
        spawnLocationCounter = 0;
      }
      spawnLocationCounter++;
      return playersSpawnLocations[spawnLocationCounter];
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
      let thisSocketSpawn = getPlayerSpawnLocation();

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

      // update final board
      socket.on("roundOutcomeRequest", function () {
        let numPlayersInfected = 0;
        let numPlayers = 0;
        let playersScoreAverage = 0;
        let bestPlayer = { name: "", score: 0 };
        Object.keys(players).forEach(function (player) {
          numPlayers++;
          if (players[player].playerCovidPos) {
            numPlayersInfected++;
          }
          if (players[player].playerScore) {
            playersScoreAverage += players[player].playerScore;
            if (players[player].playerScore > bestPlayer.score) {
              bestPlayer.score = players[player].playerScore;
              bestPlayer.name = players[player].playerName;
            }
          }
        });
        // calculate average
        playersScoreAverage = Math.floor(playersScoreAverage / numPlayers);
        // calculate victory
        let failRatio = 0.2;
        let victory =
          numPlayersInfected / numPlayers <= failRatio ? true : false;
        let data = {
          infected: numPlayersInfected,
          playerCount: numPlayers,
          scoreAvg: playersScoreAverage,
          victorious: victory,
          bestPlayer: bestPlayer,
        };
        socket.emit("roundOutcomeReply", data);
      });

      // send the players object to the new player
      socket.emit("currentPlayers", players);

      // update all other players of the new player
      socket.broadcast.emit("newPlayer", players[socket.id]);

      // update player movement
      socket.on("playerMovement", function (data) {
        players[socket.id].x = data.x;
        players[socket.id].y = data.y;
        players[socket.id].playerDir = data.playerDir;
        players[socket.id].playerCovidPos = data.covid;
        players[socket.id].playerScore = data.score;
        // emit a message to all players about the player that moved
        socket.broadcast.emit("playerMoved", players[socket.id]);
      });

      // socket event on disconnect
      socket.on("disconnect", function () {
        let mongoID = socket.request.user.id;

        // User.findByIdAndUpdate(mongoID, {username: "gobble"})
        //   .then(user => console.log)

        console.log("user disconnected | delete", players[socket.id]);
        // remove this player from our players object
        delete players[socket.id];
        console.log(
          "user disconnected | delete | should be null",
          players[socket.id]
        );
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
      setTimeout(() => {
        //Loop through current players
        Object.keys(players).forEach(function (player) {
          //Get the users current highscore
          //MAKE SURE PLAYER VALS GET UPDATED BEFORE THIS

          User.findById(players[player].playerMongoID).then((user) => {
            console.log("Player DB highScore is: ", user.highScore);
            console.log(
              "Player Round playerScore is: ",
              players[player].playerScore
            );
            if (players[player].playerScore > user.highScore) {
              //Change HighScore here if its greater than database highscore
              console.log("USER LOG ---------------------- ", user.id);
              User.findByIdAndUpdate(user.id, {
                highScore: players[player].playerScore,
              }).then((user) => {
                console.log(
                  `Updated highscore of user', ${user.username} from ${user.highScore} to ${players[player].playerScore}`
                );
              });
            }
          });
          // console.log(players[player], "GOBBLED");
        });
      }, 1000);
    }

    // Time for each game round in ms
    let gameRoundInterval = 130000;
    // Interval for calling gameReset
    setInterval(() => {
      gameReset(io, players);
    }, gameRoundInterval);

    // socket garbage collection, kill socket on round reset

    server.listen(PORT, function () {
      console.log(`Server listening on ${PORT}`);
    });
  }
);
