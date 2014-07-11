var Player = function(doer){
  var self = this;
  this.doer = doer || function(){};
  this._playHead = 0;
  this._roller = null;
}

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
  return this;
}

Player.prototype._startRoller = function(){
  self = this;
  this._roller = setInterval(function(){
    self._playHead += 1;
  }, 1);
}

Player.prototype._stopRoller = function(){
  clearInterval(this._roller);
}

Player.prototype._schedule = function(){
  self = this;
  this._timeouts = this.track.filter(function(event){
    return event.t >= self._playHead;
  }).map(function(event){
    return setTimeout(self.doer, event.t - self._playHead, event.d);
  });
}

Player.prototype._cancelScheduled = function(){
  this._timeouts.forEach(function(timeout){
    clearTimeout(timeout);
  });
}

module.exports = Player;