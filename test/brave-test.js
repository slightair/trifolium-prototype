var Brave, Spot, WaitAction, should;

should = require('should');

Brave = require('../lib/trifolium/brave').Brave;

Spot = require('../lib/trifolium/spot').Spot;

WaitAction = require('../lib/trifolium/action').WaitAction;

describe('Brave', function() {
  var brave, spot;
  spot = new Spot('testSpot', 0, 0, [
    {
      type: 'wait',
      time: 5000
    }
  ]);
  brave = new Brave('testBrave', spot);
  it('should have name', function() {
    return brave.name.should.equal('testBrave');
  });
  it('should have lv', function() {
    return brave.lv.should.equal(1);
  });
  it('should have atk', function() {
    return brave.atk.should.equal(1);
  });
  it('should have matk', function() {
    return brave.matk.should.equal(1);
  });
  it('should have hp', function() {
    return brave.hp.should.equal(10);
  });
  it('should have mp', function() {
    return brave.mp.should.equal(10);
  });
  it('should have brave', function() {
    return brave.brave.should.equal(50);
  });
  it('should have faith', function() {
    return brave.faith.should.equal(50);
  });
  it('should have speed', function() {
    return brave.speed.should.equal(3);
  });
  it('should have action', function() {
    return should.not.exist(brave.action);
  });
  it('should have actionProecss', function() {
    return brave.actionProcess.should.equal(0.0);
  });
  it('should have spot', function() {
    return brave.spot.should.equal(spot);
  });
  it('should have destination', function() {
    return brave.destination.should.equal(spot);
  });
  return describe('#tick()', function() {
    beforeEach(function() {
      brave.action = new WaitAction(3000);
      return brave.actionProcess = 0.0;
    });
    it('should be added actionProcess', function() {
      brave.tick();
      brave.actionProcess.should.be.within(0.000, 0.002);
      brave.tick();
      return brave.actionProcess.should.be.within(0.001, 0.003);
    });
    return it('should call @onCompleteAction()', function(done) {
      var i;
      brave.onCompleteAction = function(brave, action, isSucceed) {
        action.time.should.equal(3000);
        return done();
      };
      brave.tick();
      brave.actionProcess.should.be.within(0.000, 0.002);
      brave.tick();
      brave.actionProcess.should.be.within(0.001, 0.003);
      for (i = 3; i < 999; i++) {
        brave.tick();
      }
      brave.tick();
      brave.actionProcess.should.be.within(0.998, 1.000);
      return brave.tick();
    });
  });
});
