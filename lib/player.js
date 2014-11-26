var events = require('events');
var PRECISION = 50;

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
  this.pause().rewind();
  return this;
}

Player.prototype.pause = function(){
  this._stopRoller();
  this._cancelScheduled();
  return this;
}

Player.prototype.rewind = function(){
  this._playHead = 0;
  this._emitTick();
  return this;
}

Player.prototype.scrubTo = function(ms, playBetween){
  var self = this;
  var restart;
  var oldPlayHead = self._playHead;
  var going_forward = ms > oldPlayHead;
  if(this._roller){
    restart = true;
    this.pause();
  }
  if(going_forward){
    this._playBetween(oldPlayHead, ms);
  }
  this._playHead = ms;
  this._emitTick();
  if(restart){
    this._schedule();
    this.play();
  }
  return this;
}

Player.prototype.jumpTo = function(ms){
  var self = this;
  var restart;
  var oldPlayHead = self._playHead;
  if(this._roller){
    restart = true;
    this.pause();
  }
  this._playHead = ms;
  this._emitTick();
  if(restart){
    this._schedule();
    this.play();
  }
  return this;
}

Player.prototype.requestTick = function(){
  this.emit('tick', this._playHead);
}

Player.prototype.repeat = function(on_or_off){
  this.repeating = on_or_off;
  return this;
}

Player.prototype.restart = function(){
  return this.stop().play();
}

Player.prototype._emitTick = function(){
  this.emit('tick', this._playHead);
}

Player.prototype._startRoller = function(){
  self = this;
  if(this._roller) return false;
  this._roller = setInterval(function(){
    self._playHead += PRECISION;
    self._emitTick();
  }, PRECISION);
}

Player.prototype._stopRoller = function(){
  clearInterval(this._roller);
  this._roller = null;
}

Player.prototype._schedule = function(){
  if(this._timeouts) return false;
  self = this;
  this._timeouts = this.track.filter(function(event){
    return event.time >= self._playHead;
  }).map(function(event){
    return setTimeout(self.doer, event.time - self._playHead, event.data, event.channel);
  });
  if(this.repeating){
    var max_t = Math.max.apply(null, this.track.map(function(event){
      return event.time
    }));
    this._timeouts.push(setTimeout(function(){
      self.restart();
    }, max_t));
  }
}

Player.prototype._cancelScheduled = function(){
  if(!this._timeouts) return false;
  this._timeouts.forEach(function(timeout){
    clearTimeout(timeout);
  });
  this._timeouts = null;
}

Player.prototype._playBetween = function(t1, t2){
  var self = this;
  this.track.filter(function(event){
    return ( event.time > t1 && event.time <=t2 )
  }).sort(function(event){
    return event.time;
  }).forEach(function(event){
    self.doer(event.data, event.channel);
  });
}

module.exports = Player;
