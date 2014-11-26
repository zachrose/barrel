var should = require('should'),
    muxer = require('../lib/muxer');

describe("Muxer", function(){

  it("it can mux many named tracks into one track with many channels", function(){
      var muxed = muxer.mux({
        'count': [{time: 0, data: 'one'},{time: 10, data: 'two'}],
        'alphabet': [{time: 0, data: 'A'},{time: 10, data: 'B'},{time: 20, data: 'C'}],
        'numbers': [{time: 25, data: 3}]
      });
      var expected = [
        {time: 0,  channel: 'count',    data: 'one'},
        {time: 0,  channel: 'alphabet', data: 'A'},
        {time: 10, channel: 'count',    data: 'two'},
        {time: 10, channel: 'alphabet', data: 'B'},
        {time: 20, channel: 'alphabet', data: 'C'},
        {time: 25, channel: 'numbers', data: 3}
      ];
      muxed.forEach(function(event){ expected.should.containEql(event); });
      expected.forEach(function(event){ muxed.should.containEql(event); });
  });
  
  it("can demux one track with many channels into many named tracks", function(){
    var muxed = [
      {time: 0,  channel: 'count',    data: 'one'},
      {time: 0,  channel: 'alphabet', data: 'A'},
      {time: 10, channel: 'count',    data: 'two'},
      {time: 10, channel: 'alphabet', data: 'B'},
      {time: 20, channel: 'alphabet', data: 'C'},
      {time: 25, channel: 'numbers', data: 3}
    ];
    var expected = {
      'count': [{time: 0, data: 'one'},{time: 10, data: 'two'}],
      'alphabet': [{time: 0, data: 'A'},{time: 10, data: 'B'},{time: 20, data: 'C'}],
      'numbers': [{time: 25, data: 3}]
    }
    var actual = muxer.demux(muxed);
    should(actual).eql(expected);
  });
  
});
