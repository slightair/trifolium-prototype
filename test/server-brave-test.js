var Brave, Item, Spot, WaitAction, should,
  __slice = Array.prototype.slice;

should = require('should');

Brave = require('../lib/trifolium-server/brave').Brave;

Spot = require('../lib/trifolium-server/spot').Spot;

WaitAction = require('../lib/trifolium-server/action').WaitAction;

Item = require('../lib/trifolium-server/item').Item;

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
  it('should have items', function() {
    brave.items.should.be.an["instanceof"](Array);
    return brave.items.should.be.empty;
  });
  it('should have gold', function() {
    return brave.gold.should.equal(300);
  });
  it('should have eventDict', function() {
    return brave.eventDict.should.be.an["instanceof"](Object);
  });
  describe('#on()', function() {
    return it('should add event', function() {
      var hogeCallback, x;
      should.not.exist(brave.eventDict.hoge);
      hogeCallback = function() {
        return 'hoge hoge hoge';
      };
      x = brave.on('hoge', hogeCallback);
      x.should.equal(brave);
      should.exist(brave.eventDict.hoge);
      brave.eventDict.hoge().should.equal('hoge hoge hoge');
      x = brave.on('sum', function(x, y) {
        return x + y;
      });
      x.should.equal(brave);
      return brave.eventDict.sum(2, 3).should.equal(5);
    });
  });
  describe('#emit()', function() {
    return it('should emit added events', function() {
      brave.on('multi', function(x, y) {
        return x * y;
      });
      brave.emit('multi', 5, 2).should.equal(10);
      brave.on('concat', function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return args.join('');
      });
      return brave.emit('concat', 'ha', 'hi', 'hu', 'he', 'ho').should.equal('hahihuheho');
    });
  });
  describe('#tick()', function() {
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
    return it('should emit \'completeAction\'', function(done) {
      var i;
      brave.on('completeAction', function(brave, action, result) {
        action.time.should.equal(3000);
        return done();
      });
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
  describe('#addItem()', function() {
    beforeEach(function() {
      return brave.items = [];
    });
    it('should add an item', function() {
      var item, result;
      item = new Item;
      brave.items.should.be.empty;
      result = brave.addItem(item);
      brave.items.should.include(item);
      return result.should.be.ok;
    });
    return it('should not add item over 10 items', function() {
      var i, result;
      for (i = 0; i < 10; i++) {
        brave.addItem(new Item);
      }
      brave.items.should.have.length(10);
      result = brave.addItem(new Item);
      result.should.not.be.ok;
      return brave.items.should.have.length(10);
    });
  });
  return describe('#removeItem()', function() {
    var item;
    item = new Item;
    beforeEach(function() {
      return brave.items = [item];
    });
    it('should remove an item', function() {
      brave.items.should.not.be.empty;
      brave.items.should.include(item);
      brave.removeItem(item);
      brave.items.should.not.include(item);
      return brave.items.should.be.empty;
    });
    return it('should not remove no include item', function() {
      var another;
      another = new Item;
      brave.items.should.not.be.empty;
      brave.items.should.include(item);
      brave.items.should.not.include(another);
      brave.removeItem(another);
      brave.items.should.not.be.empty;
      brave.items.should.include(item);
      return brave.items.should.not.include(another);
    });
  });
});
