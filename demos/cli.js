'use strict';

var Player = require('../lib/player');

var nirvana = [
  { time: 0,    data: 'come' },
  { time: 975,  data: 'as' },
  { time: 1325, data: 'you' },
  { time: 1675, data: 'are' },
  { time: 2700, data: 'as' },
  { time: 3150, data: 'you' },
  { time: 3450, data: 'were' },
  { time: 4463, data: 'as' },
  { time: 4805, data: 'I' },
  { time: 5180, data: 'want' },
  { time: 5785, data: 'you' },
  { time: 6580, data: 'to' },
  { time: 6830, data: 'be' },
  { time: 7580, data: 0 }
];

var doer = function(e){
  return {
    string: (s) => console.log(s),
    number: (n) => process.exit(n)
  }[typeof e](e);
};

new Player(doer).load(nirvana).play();
