'use strict';

var events = require('events');
var muxer = require('./muxer.js');
var _ = require('underscore');
var PRECISION = 50;

var Player = function(doer){
  this.doer = doer || function(){};
  this._playHead = 0;
  this._roller = null;
  events.EventEmitter.call(this);
};

Player.prototype = new events.EventEmitter();

Player.prototype.load = function(track){
  this.track = track;
  return this;
};

Player.prototype.play = function(){
  if(!this.track){ throw 'Player has not track to play'; }
  this._schedule();
  this._startRoller();
  return this;
};

Player.prototype.stop = function(){
  this.pause().rewind();
  return this;
};

Player.prototype.pause = function(){
  this._stopRoller();
  this._cancelScheduled();
  return this;
};

Player.prototype.rewind = function(){
  this._playHead = 0;
  this._emitTick();
  return this;
};

Player.prototype.isPlaying = function(){
  return !!this._roller;
};

Player.prototype._jumpOrScrub = function(ms, playBetween){
  var self = this;
  var restart;
  var oldPlayHead = self._playHead;
  var goingForward = ms > oldPlayHead;
  if(this._roller){
    restart = true;
    this.pause();
  }
  if(goingForward && playBetween){
    this._playBetween(oldPlayHead, ms);
  }
  this._playHead = ms;
  this._emitTick();
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

Player.prototype._trackIsMultitrack = function(){
  return this.track.some(function(event){
    return event.channel;
  });
};

Player.prototype._playLast = function(ms){
  var self = this;
  if(this._trackIsMultitrack()){
    var channels = _(muxer.demux(this.track)).map(function(events, channel){
      return events.map(function(event){
        event.channel = channel;
        return event;
      });
    });
    _(channels).map(function(channel){
      return _(channel).max(function(event){
        var t = event.time < ms ? event.time : 0;
        return t;
      });
    }).forEach(function(event){
      self.doer(event.data, event.channel);
    });
  }else{
    var befores = this.track.filter(function(event){
      return event.time < ms;
    });
    var last = _(befores).max(function(event){
      return event.time;
    });
    self.doer(last.data, last.channel);
  }
};

Player.prototype.requestTick = function(){
  this.emit('tick', this._playHead);
};

Player.prototype.repeat = function(onOrOff){
  this.repeating = onOrOff;
  return this;
};

Player.prototype.restart = function(){
  return this.stop().play();
};

Player.prototype._emitTick = function(){
  this.emit('tick', this._playHead);
};

Player.prototype._startRoller = function(){
  var self = this;
  if(this._roller){ return false; }
  this._roller = setInterval(function(){
    self._playHead += PRECISION;
    self._emitTick();
  }, PRECISION);
};

Player.prototype._stopRoller = function(){
  clearInterval(this._roller);
  this._roller = null;
};

Player.prototype._schedule = function(){
  var self = this;
  var createTimeout = function(event){
    return setTimeout(self.doer, event.time - self._playHead, event.data, event.channel);
  };
  var isAhead = function(event){
    return event.time >= self._playHead;
  };
  this._timeouts = this.track.filter(isAhead).map(createTimeout);
  if(this.repeating){
    this._scheduleRestart();
  }
};

Player.prototype._scheduleRestart = function(){
  var self = this;
  var time = function(event){
    return event.time;
  };
  var maxTime = Math.max.apply(null, this.track.map(time));
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
  this.track.filter(function(event){
    return ( event.time > t1 && event.time <=t2 );
  }).sort(function(event){
    return event.time;
  }).forEach(function(event){
    self.doer(event.data, event.channel);
  });
};

module.exports = Player;
