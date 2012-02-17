var Spot, WaitAction;

Spot = require('../lib/trifolium/spot').Spot;

WaitAction = require('../lib/trifolium/action').WaitAction;

describe("Spot", function() {
  var spot;
  spot = new Spot('testSpot', 0, 0, [
    {
      type: 'wait',
      time: 3000
    }, {
      type: 'wait',
      time: 4000
    }, {
      type: 'wait',
      time: 5000
    }
  ]);
  it('should have name', function() {
    return spot.name.should.equal('testSpot');
  });
  it('should have posX', function() {
    return spot.posX.should.equal(0);
  });
  it('should have posY', function() {
    return spot.posY.should.equal(0);
  });
  it('should have actions', function() {
    spot.actions.should.be.an["instanceof"](Array);
    return spot.actions[0].should.be.an["instanceof"](WaitAction);
  });
  it('should be return a random action', function() {
    var action;
    action = spot.randomAction();
    action.should.be.an["instanceof"](WaitAction);
    return action.time.should.be.within(3000, 5000);
  });
  return it('should be return distance between another spot', function() {
    var another;
    another = new Spot('another', 100, 0);
    spot.distance(another).should.equal(100);
    another = new Spot('another', 0, 20);
    spot.distance(another).should.equal(20);
    another = new Spot('another', 30, 40);
    return spot.distance(another).should.equal(50);
  });
});
