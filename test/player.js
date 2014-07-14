require('should');

var sinon = require('sinon'),
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
      this.clock.tick(10);
      doer.lastCall.args[0].should.equal('boom');
      this.clock.tick(5);
      doer.lastCall.args[0].should.equal('blip');
      done();
    });
    
    it('stops and goes back to the beginning', function(done){
      player.play();
      this.clock.tick(10);
      player.stop();
      this.clock.tick(5);
      doer.lastCall.args[0].should.equal('boom');
      player.play();
      this.clock.tick(10);
      doer.callCount.should.be.exactly(2);
      doer.lastCall.args[0].should.equal('boom');
      done();
    });
    
    it('pauses and resumes', function(done){
      player.play();
      this.clock.tick(10);
      player.pause();
      this.clock.tick(5);
      doer.lastCall.args[0].should.equal('boom');
      player.play();
      this.clock.tick(5);
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
    
    it('fires a `tick` event every played ms', function(){
      var interested = sinon.spy();
      player.on('tick', interested);
      player.play();
      this.clock.tick(10);
      player.pause();
      interested.callCount.should.be.exactly(10);
      interested.lastCall.args[0].should.equal(10);
    });
    
  });
  
});
