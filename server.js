const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require("socket.io").listen(server);

// array of players
let players = {};
let playersSpawnLocations = [(800, 800)]

// server static public folder
app.use(express.static(__dirname + '/public'));

// base url will serve public/index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
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
server.listen(3000, function () {
  console.log('Server listening');
});