require('should');

var assert = require('assert'),
    sinon = require('sinon'),
    Recorder = require('../lib/recorder');
    


describe("Recorder", function(){
  it("it created with nothing special", function(){
    recorder = new Recorder();
    recorder.should.be.ok;
  });
  describe("recording", function(){
    
    beforeEach(function(){
      this.clock = sinon.useFakeTimers();
      this.recorder = new Recorder()
    });
    
    afterEach(function(){
      this.clock.restore();
    });
    
    it("can record some events", function(){
      recorder.record();
      this.clock.tick(125);
      recorder.capture("YAY");
      this.clock.tick(50);
      recorder.capture("DONE");
      recorder.stop();
      var track = recorder.eject(); // -> track
      debugger;
      track.length.should.equal(2);
      track[0].data.should.equal("YAY")
      track[0].time.should.equal(125);
    });
  });
});