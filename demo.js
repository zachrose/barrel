Player = require('./player');

player = new Player(function(d){
  console.log(d);
}).load([
  { t: 2*0,    d: "this" },
  { t: 2*100,  d: "is" },
  { t: 2*150,  d: "a" },
  { t: 2*500,  d: "very" },
  { t: 2*530,  d: "very" },
  { t: 2*560,  d: "very" },
  { t: 2*900,  d: "impressive" },
  { t: 2*1000, d: "demo" }
]).play();

setTimeout(function(){
  process.exit(0);
}, 2*1000);