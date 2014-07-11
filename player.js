var Player = function(doer){
  this.doer = doer || function(){};
  this._playHead = 0;
}

Player.prototype.load = function(track){
  this.track = track;
}

Player.prototype.play = function(){
  var self = this;
  if(!this.track){
    throw "Player has not track to play";
  }
  this._timeouts = this.track.map(function(event){
    if(event.t >= self._playHead){
      return setTimeout(self.doer, event.t, event.d);
    }
  });
}

Player.prototype.stop = function(){
  this._timeouts.forEach(function(timeout){
    clearTimeout(timeout);
  });
  this._playHead = 0;
}

Player.prototype.pause = function(){
  
}

module.exports = Player;