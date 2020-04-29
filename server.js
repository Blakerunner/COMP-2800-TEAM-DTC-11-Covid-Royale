const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require("socket.io").listen(server);

// server static public folder
app.use(express.static(__dirname + '/public'));

// base url will serve public/index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
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