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
  it('should have listeners', function() {
    brave.listeners.should.be.an["instanceof"](Array);
    return brave.listeners.should.be.empty;
  });
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
  describe('#tick()', function() {
    beforeEach(function() {
      return brave.action = new WaitAction(3000);
    });
    it('should be added actionProcess', function() {
      var i, result;
      result = brave.tick();
      brave.actionProcess.should.be.within(0.000, 0.002);
      should.not.exist(result);
      result = brave.tick();
      brave.actionProcess.should.be.within(0.001, 0.003);
      should.not.exist(result);
      for (i = 3; i < 999; i++) {
        brave.tick();
      }
      result = brave.tick();
      brave.actionProcess.should.be.within(0.998, 1.000);
      should.not.exist(result);
      result = brave.tick();
      return result.should.equal(true);
    });
    return it('should be return null when brave has no action', function() {
      var result;
      brave.action = null;
      result = brave.tick();
      return should.not.exist(result);
    });
  });
  describe('#addListener()', function() {
    beforeEach(function() {
      return brave.listeners = [];
    });
    return it('should push listener to listeners', function() {
      var listener;
      listener = {
        name: 'testListener'
      };
      brave.listeners.should.be.empty;
      brave.addListener(listener);
      brave.listeners.should.have.length(1);
      return brave.listeners.should.include(listener);
    });
  });
  describe('#removeListener()', function() {
    beforeEach(function() {
      return brave.listeners = [
        {
          name: 'listenerA'
        }, {
          name: 'listenerB'
        }, {
          name: 'listenerC'
        }
      ];
    });
    return it('should remove listener from listeners', function() {
      var listener;
      listener = {
        name: 'testListener'
      };
      brave.addListener(listener);
      brave.listeners.should.have.length(4);
      brave.listeners.should.include(listener);
      brave.removeListener(listener);
      brave.listeners.should.have.length(3);
      return brave.listeners.should.not.include(listener);
    });
  });
  return describe('#doneAction()', function() {
    beforeEach(function() {
      return brave.listeners = [];
    });
    return it('should call each listeners #completeBraveAction()', function(done) {
      var listener;
      listener = {
        completeBraveAction: function(brave, action) {
          return done();
        }
      };
      brave.addListener(listener);
      return brave.doneAction('action');
    });
  });
});
