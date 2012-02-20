var Action, Brave, MoveAction, SearchAction, Spot, WaitAction, should, _ref;

should = require('should');

Brave = require('../lib/trifolium/brave').Brave;

Spot = require('../lib/trifolium/spot').Spot;

_ref = require('../lib/trifolium/action'), Action = _ref.Action, WaitAction = _ref.WaitAction, MoveAction = _ref.MoveAction, SearchAction = _ref.SearchAction;

describe('Action', function() {
  var action;
  action = new Action;
  it('should have no name', function() {
    return should.not.exist(action.name);
  });
  it('should have time', function() {
    return action.time.should.equal(0);
  });
  describe('#do()', function() {
    var brave, spot;
    spot = new Spot('testSpot', 0, 0);
    brave = new Brave('testBrave', spot);
    beforeEach(function() {
      brave.listeners = [];
      brave.action = 'dummy';
      return brave.actionProcess = 0.5;
    });
    it('should return false', function() {
      return (action["do"](brave)).should.be["false"];
    });
    it('should set null to brave.action', function() {
      action["do"](brave);
      return should.not.exist(brave.action);
    });
    return it('should set 0.0 to brave.actionProcess', function() {
      action["do"](brave);
      return brave.actionProcess.should.equal(0);
    });
  });
  return describe('#after()', function() {
    var brave, nextAction, spot;
    nextAction = new Action;
    spot = new Spot('testSpot', 0, 0);
    brave = new Brave('testBrave', spot);
    beforeEach(function() {
      nextAction.prepare = function() {};
      return brave.action = 'dummy';
    });
    it('should call nextAction.prepare()', function(done) {
      nextAction.prepare = function(brave) {
        return done();
      };
      return action.after(brave, nextAction);
    });
    it('should set nextAction to brave.action', function() {
      action.after(brave, nextAction);
      brave.action.should.not.equal('dummy');
      return brave.action.should.equal(nextAction);
    });
    it('should set same spot to brave.destination', function() {
      action.after(brave, nextAction);
      return brave.destination.should.equal(spot);
    });
    return it('should set destination to brave.destination', function() {
      var fromSpot, moveAction, toSpot;
      fromSpot = new Spot('from', 10, 10);
      toSpot = new Spot('to', 20, 20);
      moveAction = new MoveAction(fromSpot, toSpot);
      action.after(brave, moveAction);
      return brave.destination.should.equal(toSpot);
    });
  });
});

describe('WaitAction', function() {
  var action;
  action = new WaitAction(5000);
  it('should have name', function() {
    return action.name.should.equal('wait');
  });
  it('should have time', function() {
    return action.time.should.equal(5000);
  });
  return describe('#do()', function() {
    var brave, spot;
    spot = new Spot('testSpot', 0, 0, [
      {
        type: 'wait',
        time: 3000
      }
    ]);
    brave = new Brave('testBrave', spot);
    beforeEach(function() {
      brave.action = 'dummy';
      return brave.actionProcess = 0.5;
    });
    it('should return true', function() {
      return (action["do"](brave)).should.be["true"];
    });
    return it('should select next action from spot', function() {
      action["do"](brave);
      brave.action.name.should.equal('wait');
      return brave.action.time.should.equal(3000);
    });
  });
});

describe('MoveAction', function() {
  var action, fromSpot, toSpot;
  fromSpot = new Spot('from', 10, 10, [
    {
      type: 'wait',
      time: 3000
    }
  ]);
  toSpot = new Spot('to', 10, 20, [
    {
      type: 'wait',
      time: 5000
    }
  ]);
  action = new MoveAction(fromSpot, toSpot);
  it('should have name', function() {
    return action.name.should.equal('move');
  });
  it('should have from', function() {
    return action.from.name.should.equal('from');
  });
  it('should have to', function() {
    return action.to.name.should.equal('to');
  });
  it('should have time', function() {
    return action.time.should.equal(1000);
  });
  return describe('#do()', function() {
    var brave;
    brave = new Brave('testBrave', fromSpot);
    beforeEach(function() {
      brave.action = 'dummy';
      return brave.spot = fromSpot;
    });
    it('should return true', function() {
      return (action["do"](brave)).should.be["true"];
    });
    it('should set @to to brave.spot', function() {
      action["do"](brave);
      return brave.spot.name.should.equal('to');
    });
    return it('should select next action from @to', function() {
      action["do"](brave);
      brave.action.name.should.equal('wait');
      return brave.action.time.should.equal(5000);
    });
  });
});

describe('SearchAction', function() {
  it('should have name');
  it('should have time');
  return it('should ...');
});
