var events = require('events');

var Player = function(doer){
  var self = this;
  this.doer = doer || function(){};
  this._playHead = 0;
  this._roller = null;
  events.EventEmitter.call(this);
}

Player.prototype.__proto__ = events.EventEmitter.prototype;

Player.prototype.load = function(track){
  this.track = track;
  return this;
}

Player.prototype.play = function(){
  if(!this.track){ throw "Player has not track to play"; }
  this._schedule();
  this._startRoller();
  return this;
}

Player.prototype.stop = function(){
  this.pause().rewind();;
  return this;
}

Player.prototype.pause = function(){
  this._stopRoller();
  this._cancelScheduled();
  return this;
}

Player.prototype.rewind = function(){
  this._playHead = 0;
  self._emitTick();
  return this;
}

Player.prototype._emitTick = function(){
  this.emit('tick', this._playHead);
}

Player.prototype._startRoller = function(){
  self = this;
  if(this._roller) return false;
  this._roller = setInterval(function(){
    self._playHead += 10;
    self._emitTick();
  }, 10);
}

Player.prototype._stopRoller = function(){
  clearInterval(this._roller);
  this._roller = null;
}

Player.prototype._schedule = function(){
  if(this._timeouts) return false;
  self = this;
  this._timeouts = this.track.filter(function(event){
    return event.t >= self._playHead;
  }).map(function(event){
    return setTimeout(self.doer, event.t - self._playHead, event.d);
  });
}

Player.prototype._cancelScheduled = function(){
  if(!this._timeouts) return false;
  this._timeouts.forEach(function(timeout){
    clearTimeout(timeout);
  });
  this._timeouts = null;
}

module.exports = Player;