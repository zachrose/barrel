var should = require('should'),
    muxer = require('../lib/muxer');

describe("Muxer", function(){

  it("it can mux many named tracks into one track with many channels", function(){
      var muxed = muxer.mux({
        'count': [{t: 0, d: 'one'},{t: 10, d: 'two'}],
        'alphabet': [{t: 0, d: 'A'},{t: 10, d: 'B'},{t: 20, d: 'C'}],
        'numbers': [{t: 25, d: 3}]
      });
      var expected = [
        {t: 0,  channel: 'count',    d: 'one'},
        {t: 0,  channel: 'alphabet', d: 'A'},
        {t: 10, channel: 'count',    d: 'two'},
        {t: 10, channel: 'alphabet', d: 'B'},
        {t: 20, channel: 'alphabet', d: 'C'},
        {t: 25, channel: 'numbers', d: 3}
      ];
      muxed.forEach(function(event){ expected.should.containEql(event); });
      expected.forEach(function(event){ muxed.should.containEql(event); });
  });
  
  it("can demux one track with many channels into many named tracks", function(){
    var muxed = [
      {t: 0,  channel: 'count',    d: 'one'},
      {t: 0,  channel: 'alphabet', d: 'A'},
      {t: 10, channel: 'count',    d: 'two'},
      {t: 10, channel: 'alphabet', d: 'B'},
      {t: 20, channel: 'alphabet', d: 'C'},
      {t: 25, channel: 'numbers', d: 3}
    ];
    var expected = {
      'count': [{t: 0, d: 'one'},{t: 10, d: 'two'}],
      'alphabet': [{t: 0, d: 'A'},{t: 10, d: 'B'},{t: 20, d: 'C'}],
      'numbers': [{t: 25, d: 3}]
    }
    var actual = muxer.demux(muxed);
    should(actual).eql(expected);
  });
  
});
