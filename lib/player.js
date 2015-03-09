'use strict';

var events = require('events');
var TrackFactory = require('./track.js');
var trackFactory = new TrackFactory();
var Roller = require('./roller');
var Playhead = require('./playhead');

var Player = function(doer){
  this.doer = doer || function(){};
  this.playhead = new Playhead();
  this.roller = new Roller(this.requestTick.bind(this), this.playhead);
  events.EventEmitter.call(this);
};

Player.prototype = new events.EventEmitter();

Player.prototype.load = function(track){
  this.track = trackFactory.createTrack(track);
  return this;
};

Player.prototype.play = function(){
  this._schedule();
  this.roller.start();
  return this;
};

Player.prototype.stop = function(){
  this.pause().rewind();
  return this;
};

Player.prototype.pause = function(){
  this.roller.stop();
  this._cancelScheduled();
  return this;
};

Player.prototype.rewind = function(){
  this.playhead.rewind();
  this.requestTick();
  return this;
};

Player.prototype.isPlaying = function(){
  return this.roller.rolling;
};

Player.prototype._jumpOrScrub = function(ms, playBetween){
  var restart;
  var oldPlayHead = this.playhead.value();
  var goingForward = ms > oldPlayHead;
  if(this.isPlaying){
    restart = true;
    this.pause();
  }
  if(goingForward && playBetween){
    this._playBetween(oldPlayHead, ms);
  }
  this.playhead.set(ms);
  this.requestTick();
  if(restart){
    this._schedule();
    this.play();
  }
  return this;
};

Player.prototype.scrubTo = function(ms){
  this._jumpOrScrub(ms, true);
};

Player.prototype.jumpTo = function(ms, playLast){
  this._jumpOrScrub(ms, false);
  if(playLast){
    this._playLast(ms);
  }
};

Player.prototype._playLast = function(ms){
  var self = this;
  var lastEvents = this.track.lastEventsBefore(ms);
  lastEvents.forEach(function(event){
    self.doer(event.data, event.channel);
  });
};

Player.prototype.requestTick = function(){
  this.emit('tick', this.playhead.value());
};

Player.prototype.repeat = function(onOrOff){
  this.repeating = onOrOff;
  return this;
};

Player.prototype.restart = function(){
  return this.stop().play();
};

Player.prototype._schedule = function(){
  var self = this;
  var now = this.playhead.value();
  var createTimeout = function(event){
    return setTimeout(self.doer, event.time - now, event.data, event.channel);
  };
  this._timeouts = this.track.after(now).map(createTimeout);
  if(this.repeating){
    this._scheduleRestart();
  }
};

Player.prototype._scheduleRestart = function(){
  var self = this;
  var maxTime = this.track.lastTime();
  var restart = setTimeout(function(){
    self.restart();
  }, maxTime);
  this._timeouts.push(restart);
};

Player.prototype._cancelScheduled = function(){
  if(!this._timeouts){ return false; }
  this._timeouts.forEach(function(timeout){
    clearTimeout(timeout);
  });
  this._timeouts = null;
};

Player.prototype._playBetween = function(t1, t2){
  var self = this;
  this.track.between(t1, t2).forEach(function(event){
    self.doer(event.data, event.channel);
  });
};

module.exports = Player;
