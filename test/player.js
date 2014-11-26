require('should');

var assert = require('assert'),
    sinon = require('sinon'),
    Player = require('../lib/player');

describe("Player", function(){

  it("accepts a doer", function(){
    var doer = sinon.spy();
    var player = new Player(doer);
    player.doer.should.equal(doer);
  });
  
  it('can load a Track', function(){
    var track = require('./fixtures/track');
    var player = new Player().load(track);
    player.track.should.equal(track);
  });
  
  describe("playback", function(){
    var doer = sinon.spy(),
        player = null;
    
    beforeEach(function(){
      this.clock = sinon.useFakeTimers();
      var track = require('./fixtures/track');
      player = new Player(doer).load(track);
    });
    
    afterEach(function(){
      doer.reset();
      this.clock.restore();
    });
    
    it('plays the right things at the right times', function(done){
      player.play();
      doer.callCount.should.be.exactly(0);
      this.clock.tick(101);
      doer.lastCall.args[0].should.equal('boom');
      this.clock.tick(100);
      doer.lastCall.args[0].should.equal('blip');
      done();
    });
    
    it('plays a multichannel track, calls the doer with the channel like so', function(){
      var multichannel = [
        {time: 0, data: "A", channel: 'my_great_channel'}
      ];
      player.load(multichannel);
      player.play();
      this.clock.tick(1);
      doer.lastCall.args[1].should.equal('my_great_channel');
    });
    
    it('stops and goes back to the beginning', function(done){
      player.play();
      // 50
      this.clock.tick(50);
      player.stop();
      // stopped
      this.clock.tick(100);
      doer.callCount.should.be.exactly(0);
      player.play();
      // 150 on track
      this.clock.tick(100);
      doer.callCount.should.be.exactly(1);
      doer.lastCall.args[0].should.equal('boom');
      done();
    });
    
    it('pauses and resumes', function(done){
      player.play();
      this.clock.tick(150);
      player.pause();
      doer.callCount.should.be.exactly(1);
      doer.lastCall.args[0].should.equal('boom');
      player.play();
      this.clock.tick(100);
      doer.callCount.should.be.exactly(2);
      doer.lastCall.args[0].should.equal('blip');
      done();
    });
    
    it('quietly accepts nonsense', function(done){
      player.stop();
      player.stop();
      player.pause();
      player.pause();
      done();
    })
    
    it('fires a `tick` event with the ms', function(){
      var interested = sinon.spy();
      player.on('tick', interested);
      player.play();
      this.clock.tick(500);
      player.pause();
      interested.lastCall.args[0].should.equal(500);
    });
    
    it('fires a `tick` when the player stops', function(){
      var interested = sinon.spy();
      player.on('tick', interested);
      player.play();
      this.clock.tick(10);
      player.stop();
      interested.lastCall.args[0].should.equal(0);
    });
    
    it('fires a `tick` when requested', function(){
      var interested = sinon.spy();
      player.on('tick', interested);
      player.play();
      this.clock.tick(150);
      player.requestTick();
      interested.lastCall.args[0].should.equal(150);
    });
    
    it("can be set to repeat", function(){
      player.repeat(true).play();
      this.clock.tick(400);
      player.doer.callCount.should.equal(4);
      player.doer.lastCall.args[0].should.equal('blip');
    });
    
    describe("scrubbing", function(){

      it('can be scrubbed while not playing', function(){
        player.scrubTo(90);
        assert.equal(player.doer.lastCall, undefined);
        player.play();
        this.clock.tick(20);
        player.doer.lastCall.args[0].should.equal('boom');
      });
      
      it('can be scrubbed while playing', function(){
        player.play();
        player.scrubTo(100);
        player.doer.lastCall.args[0].should.equal('boom');
      });
      
      it('ticks at the end of a scrub', function(){
        var interested = sinon.spy()
        player.on('tick', interested);
        player.scrubTo(90);
        interested.lastCall.args[0].should.equal(90);        
      });
    
    });
    
    describe("jumping", function(){
      
      it('can jump to a new time by skipping over events', function(){
        player.play();
        player.jumpTo(180);
        assert.equal(player.doer.lastCall, undefined);
        this.clock.tick(40);
        player.doer.lastCall.args[0].should.equal('blip');
      });
      
      it('ticks at the end of a jump', function(){
        var interested = sinon.spy()
        player.on('tick', interested);
        player.jumpTo(90);
        interested.lastCall.args[0].should.equal(90);
      });
      
    });

  });
  
});
