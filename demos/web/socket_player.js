var WebSocketServer = require('ws').Server,
    express = require('express'),
    app = express(),
    Player = require('../../lib/player');

var track = [
  { t: 100,  d: {hue:   0, saturation: 100, lightness: 50}},
  { t: 200,  d: {hue:  60, saturation: 100, lightness: 50}},
  { t: 300,  d: {hue: 120, saturation: 100, lightness: 50}},
  { t: 400,  d: {hue: 180, saturation: 100, lightness: 50}},
  { t: 500, d: {hue: 240, saturation: 100, lightness: 50}},
  { t: 600, d: {hue: 300, saturation: 100, lightness: 50}},
];

webSocketServer = new WebSocketServer({port: 8080})

webSocketServer.on('connection', function(socket){
  socket.on('message', function(message){
    var sender = function(d){ socket.send(JSON.stringify(d)); };
    var player = new Player(sender).load(track).play();
  });
});
 
app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
});

app.listen(3000, function() {
    console.log('Listening on port 3000');
});

