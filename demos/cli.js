Player = require('../lib/player');

player = new Player(function(d){
  console.log(d);
}).load([
  { t: 2*0,  d: "Come" },
  { t: 2*500,  d: "as" },
  { t: 2*750,  d: "you" },
  { t: 2*875,  d: "are" },
  { t: 2*1500,  d: "as" },
  { t: 2*1750,  d: "you" },
  { t: 2*1825,  d: "were" },
  { t: 2*2675,  d: "as" },
  { t: 2*2750,  d: "I" },
  { t: 2*2850,  d: "want" },
  { t: 2*3000,  d: "you" },
  { t: 2*3250,  d: "to" },
  { t: 2*3500,  d: "be" },
]).play();

setTimeout(function(){
  process.exit(0);
}, 7500);
