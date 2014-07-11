var Player = function(doer){
  this.doer = doer || function(){};
}

Player.prototype.load = function(track){
  this.track = track;
}

Player.prototype.play = function(){
  if(!this.track){
    throw "Player has not track to play";
  }
  var self = this;
  this._timeouts = this.track.map(function(event){
    setTimeout(self.doer, event.t, event.d);
  })
}

Player.prototype.stop = function(){
  
}

Player.prototype.pause = function(){
  
}

module.exports = Player;