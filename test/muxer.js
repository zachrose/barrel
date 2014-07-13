var should = require('should'),
    Muxer = require('../lib/muxer');

describe("Muxer", function(){

  it("it can mux two named tracks into one", function(){
      var muxed = new Muxer().mux({
        'count': [{t: 0, d: 'one'},{t: 10, d: 'two'}],
        'alphabet': [{t: 0, d: 'A'},{t: 10, d: 'B'},{t: 20, d: 'C'}]
      });
      var expected = [
        {t: 0,  track: 'count',    d: 'one'},
        {t: 0,  track: 'alphabet', d: 'A'},
        {t: 10, track: 'count',    d: 'two'},
        {t: 10, track: 'alphabet', d: 'B'},
        {t: 20, track: 'alphabet', d: 'C'}
      ];
      muxed.forEach(function(event){ expected.should.containEql(event); });
      expected.forEach(function(event){ muxed.should.containEql(event); });
  });
  
  it("can demux previously muxed named tracks", function(){
    var muxed = [
      {t: 0,  track: 'count',    d: 'one'},
      {t: 0,  track: 'alphabet', d: 'A'},
      {t: 10, track: 'count',    d: 'two'},
      {t: 10, track: 'alphabet', d: 'B'},
      {t: 20, track: 'alphabet', d: 'C'}
    ];
    var expected = {
      'count': [{t: 0, d: 'one'},{t: 10, d: 'two'}],
      'alphabet': [{t: 0, d: 'A'},{t: 10, d: 'B'},{t: 20, d: 'C'}]
    }
    var actual = new Muxer().demux(muxed);
    should(actual).eql(expected);
  });
  
});
