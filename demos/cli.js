Player = require('../lib/player');

player = new Player(function(d){
  console.log(d);
}).load([
  { t: 0,     d: "this" },
  { t: 200,   d: "is" },
  { t: 300,   d: "a" },
  { t: 1000,  d: "very" },
  { t: 1060,  d: "very" },
  { t: 1120,  d: "very" },
  { t: 1800,  d: "impressive" },
  { t: 2000,  d: "demo" }
]).play();

setTimeout(function(){
  process.exit(0);
}, 3000);
