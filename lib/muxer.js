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
  var clone = JSON.parse(JSON.stringify(track_of_named_events));
  clone.forEach(function(event){
    var track_name = event.channel;
    delete event.channel;
    if(!out[track_name]) out[track_name] = [];
    out[track_name].push(event);
  })
  return out;
}

module.exports = {
  mux: mux,
  demux: demux
};