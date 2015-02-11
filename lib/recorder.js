var PRECISION = 50;

var Recorder = function(){
  this.track = [];
  this._playHead = 0;
  this._roller = null;
}

Recorder.prototype.record = function(){
  this._specialMoment = new Date();
  this._startRoller();
  return this;
}

Recorder.prototype.capture = function(data){
  var now = new Date();
  var timeSinceSpecialMoment = now - this._specialMoment;
  this.track.push({
    time: timeSinceSpecialMoment,
    data: data
  })
}

Recorder.prototype.eject = function(){
  return this.track;
}

Recorder.prototype.stop = function(){
  this.pause().rewind();
  return this;
}

Recorder.prototype.pause = function(){
  this._stopRoller();
  this._cancelScheduled();
  return this;
}

Recorder.prototype.rewind = function(){
  this._playHead = 0;
  this._emitTick();
  return this;
}

Recorder.prototype._emitTick = function(){}

Recorder.prototype._startRoller = function(){
  self = this;
  if(this._roller) return false;
  this._roller = setInterval(function(){
    self._playHead += PRECISION;
    self._emitTick();
  }, PRECISION);
}

Recorder.prototype._stopRoller = function(){
  clearInterval(this._roller);
  this._roller = null;
}

Recorder.prototype._cancelScheduled = function(){
  if(!this._timeouts) return false;
  this._timeouts.forEach(function(timeout){
    clearTimeout(timeout);
  });
  this._timeouts = null;
}

module.exports = Recorder;
