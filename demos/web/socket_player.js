'use strict';

var WebSocketServer = require('ws').Server,
    express = require('express'),
    app = express(),
    Player = require('../../lib/player');

var track = [
  { time: 100, data: {hue:   0, saturation: 100, lightness: 50}},
  { time: 200, data: {hue:  60, saturation: 100, lightness: 50}},
  { time: 300, data: {hue: 120, saturation: 100, lightness: 50}},
  { time: 400, data: {hue: 180, saturation: 100, lightness: 50}},
  { time: 500, data: {hue: 240, saturation: 100, lightness: 50}},
  { time: 600, data: {hue: 300, saturation: 100, lightness: 50}},
];

var webSocketServer = new WebSocketServer({port: 8080});

webSocketServer.on('connection', function(socket){
  var sender = function(d){ socket.send(JSON.stringify(d)); };
  socket.on('message', function(){
    new Player(sender).load(track).play();
  });
});
 
app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});

