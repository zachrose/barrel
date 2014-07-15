var Muxer = function(){};

Muxer.prototype.mux = function(named_tracks){
  var out = [];
  for (name in named_tracks) {
    var named_track = named_tracks[name];
    named_track.forEach(function(event){
      event.channel = name;
      out.push(event);
    })
  }
  return out;
}

Muxer.prototype.demux = function(track_of_named_events){
  var out = {}
  track_of_named_events.forEach(function(event){
    var track_name = event.channel;
    delete event.channel;
    if(!out[track_name]) out[track_name] = [];
    out[track_name].push(event);
  })
  return out;
}

module.exports = Muxer;