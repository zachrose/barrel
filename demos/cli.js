Player = require('../lib/player');

player = new Player(function(d){
  console.log(d);
}).load([
  { time: 1.2*0,     data: "Come" },
  { time: 1.2*500,   data: "as" },
  { time: 1.2*750,   data: "you" },
  { time: 1.2*875,   data: "are" },
  { time: 1.2*1500,  data: "as" },
  { time: 1.2*1750,  data: "you" },
  { time: 1.2*1825,  data: "were" },
  { time: 1.2*2675,  data: "as" },
  { time: 1.2*2750,  data: "I" },
  { time: 1.2*2850,  data: "want" },
  { time: 1.2*3000,  data: "you" },
  { time: 1.2*3250,  data: "to" },
  { time: 1.2*3500,  data: "be" },
]).play();

setTimeout(function(){
  process.exit(0);
}, 1.2*4000);
