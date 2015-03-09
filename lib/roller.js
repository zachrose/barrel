'use strict';

var PRECISION = 50;

var Roller = function(tick, playhead){
  this.playhead = playhead;
  this.tick = tick;
  this.rolling = false;
};

Roller.prototype.start = function(){
  var tick = this.tick;
  var bump = this.playhead.bump.bind(this.playhead);
  this.interval = setInterval(function(){
    bump(PRECISION);
    tick();
  }, PRECISION);
  this.rolling = true;
};

Roller.prototype.stop = function(){
  clearInterval(this.interval);
  this.rolling = false;
};

module.exports = Roller;