'use strict';

var Playhead = function(){
  this.v = 0;
};

Playhead.prototype.set = function(t){
  this.v = t;
};

Playhead.prototype.rewind = function(){
  this.v = 0;
};

Playhead.prototype.value = function(){
  return this.v;
};

Playhead.prototype.bump = function(amount){
  this.v += amount;
};

module.exports = Playhead;