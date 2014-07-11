var WebSocketServer = require('ws').Server,
    express = require('express'),
    app = express(),
    Player = require('../../player');

var track = [
  { t: 200*1,  d: {hue:   0, saturation: 100, lightness: 50}},
  { t: 200*2,  d: {hue:  60, saturation: 100, lightness: 50}},
  { t: 200*3,  d: {hue: 120, saturation: 100, lightness: 50}},
  { t: 200*4,  d: {hue: 180, saturation: 100, lightness: 50}},
  { t: 200*5,  d: {hue: 240, saturation: 100, lightness: 50}},
  { t: 200*6,  d: {hue: 300, saturation: 100, lightness: 50}},
];

wss = new WebSocketServer({port: 8080})

wss.on('connection', function(ws){
    ws.on('message', function(message){
        player = new Player(function(d){
          ws.send(JSON.stringify(d));
        }).load(track2).play();
    });
});
 
app.get('/', function(req, res){
  res.sendfile(__dirname+'/index.html');
});

app.listen(3000, function() {
    console.log('Listening on port 3000');
});

