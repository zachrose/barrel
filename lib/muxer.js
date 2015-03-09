'use strict';

var mux = function(namedTracks){
  var out = [];
  for (var name in namedTracks) {
    var namedTrack = namedTracks[name];
    for(var i = 0; i < namedTrack.length; i++){
      var event = namedTrack[i];
      event.channel = name;
      out.push(event);
    }
  }
  return out;
};

var demux = function(trackOfNamedEvents){
  var out = {};
  for(var i = 0, l = trackOfNamedEvents.length; i<l; i++){
    var event = trackOfNamedEvents[i];
    var trackName = event.channel;
    if(!out[trackName]){ out[trackName] = []; }
    out[trackName].push({
      time: event.time,
      data: event.data
    });
  }
  return out;
};

module.exports = {
  mux: mux,
  demux: demux
};
