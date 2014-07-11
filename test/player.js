require('should');

var sinon = require('sinon'),
    Player = require('../player');

describe("Player", function(){
  
  beforeEach(function(){
    this.clock = sinon.useFakeTimers();
  });
  
  afterEach(function(){
    this.clock.restore();
  });
  
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
    var self = this,
        doer = sinon.spy(),
        player = null;
    
    beforeEach(function(){
      var track = require('./fixtures/track');
      player = new Player(doer).load(track).play();
    });
    
    afterEach(function(){
      doer.reset();
    });
    
    it('plays the right things at the right times', function(done){
      doer.callCount.should.be.exactly(0);
      this.clock.tick(10);
      doer.lastCall.args[0].should.equal('boom');
      this.clock.tick(5);
      doer.lastCall.args[0].should.equal('blip');
      done();
    });
    
    it('stops and goes back to the beginning', function(done){
      this.clock.tick(10);
      player.stop();
      this.clock.tick(5);
      doer.lastCall.args[0].should.equal('boom');
      player.play();
      this.clock.tick(10);
      doer.callCount.should.be.exactly(2);
      done();
    });
    
    it('pauses and resumes', function(done){
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
  });
  
})