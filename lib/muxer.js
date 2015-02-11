var mux = function(named_tracks){
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

var demux = function(track_of_named_events){
  var out = {}
  for(var i = 0, l = track_of_named_events.length; i<l; i++){
    var event = track_of_named_events[i];
    var track_name = event.channel;
    if(!out[track_name]) out[track_name] = [];
    out[track_name].push({
      time: event.time,
      data: event.data
    });
  }
  return out;
}

module.exports = {
  mux: mux,
  demux: demux
};
