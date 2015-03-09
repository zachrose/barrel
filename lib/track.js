'use strict';
var muxer = require('./muxer.js');
var _ = require('underscore');

var isMultitrack = function(events){
  return events.some(function(event){
    return event.channel;
  });
};

var SinglechannelTrack = function(events){
  this.events = events;
  this.lastEventsBefore = function(time){
    var last = _(this.before(time)).max(function(event){
      return event.time;
    });
    return [last];
  };
};

var MultichannelTrack = function(events){
  this.events = events;
  this.toChannels = function(){
    return _(muxer.demux(this.events)).map(function(events, channel){
      return events.map(function(event){
        event.channel = channel;
        return event;
      });
    });
  };
  this.lastEventsBefore = function(time){
    var channels = this.toChannels();
    return _(channels).map(function(channel){
      return _(channel).max(function(event){
        var t = event.time < time ? event.time : 0;
        return t;
      });
    });
  };
};

var TrackFactory = function(){
  this.createTrack = function(events){
    var track;
    if(isMultitrack(events)){
      track = new MultichannelTrack(events);
    }else{
      track = new SinglechannelTrack(events);
    }
    
    track.before = function(time){
      return events.filter(function(event){
        return event.time < time;
      });
    };
    
    track.after = function(time){
      return events.filter(function(event){
        return event.time >= time;
      });
    };
    
    track.between = function(t1, t2){
      return events.filter(function(event){
        return ( event.time > t1 && event.time <=t2 );
      });
    };

    track.times = function(){
      return events.map(function(event){
        return event.time;
      });
    };

    track.lastTime = function(){
      return Math.max.apply(null, this.times());
    };
    
    return track;
  };
};

module.exports = TrackFactory;