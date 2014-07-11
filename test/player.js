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
    var player = new Player();
    player.load(track);
    player.track.should.equal(track);
  });
  
  describe("playing", function(){
    
    var self = this,
        doer = sinon.spy();
    
    beforeEach(function(){
      var player = new Player(doer);
      var track = require('./fixtures/track');
      player.load(track);
      player.play();
    });
    
    afterEach(function(){
      doer.reset();
    });
    
    it('does the right things at the right times', function(done){
      doer.callCount.should.be.exactly(0);
      this.clock.tick(10);
      doer.lastCall.args[0].should.equal('boom');
      this.clock.tick(5);
      doer.lastCall.args[0].should.equal('blip');
      done();
    });

  })
  
})