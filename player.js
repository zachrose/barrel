var Player = function(doer){
  var self = this;
  this.doer = doer || function(){};
  this._playHead = 0;
}

Player.prototype.load = function(track){
  this.track = track;
  return this;
}

Player.prototype.play = function(){
  var self = this;
  if(!this.track){
    throw "Player has not track to play";
  }
  this._timeouts = this.track.filter(function(event){
    return event.t >= self._playHead;
  }).map(function(event){
    return setTimeout(self.doer, event.t - self._playHead, event.d);
  });
  this._roller = setInterval(function(){
    self._playHead += 1;
  }, 1);
  return this;
}

Player.prototype.stop = function(){
  this._timeouts.forEach(function(timeout){
    clearTimeout(timeout);
  });
  clearInterval(this._roller);
  this._playHead = 0;
  return this;
}

Player.prototype.pause = function(){
  this._timeouts.forEach(function(timeout){
    clearTimeout(timeout);
  });
  clearInterval(this._roller);
  return this;
}

module.exports = Player;