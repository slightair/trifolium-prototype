var Action, Brave, MoveAction, SearchAction, SharedItemCreator, Spot, WaitAction, serverLibPath, should, _ref;

should = require('should');

serverLibPath = '../../../lib/trifolium-server';

Brave = require("" + serverLibPath + "/brave").Brave;

Spot = require("" + serverLibPath + "/spot").Spot;

_ref = require("" + serverLibPath + "/action"), Action = _ref.Action, WaitAction = _ref.WaitAction, MoveAction = _ref.MoveAction, SearchAction = _ref.SearchAction;

SharedItemCreator = require("" + serverLibPath + "/item").SharedItemCreator;

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
    it('should return Object', function() {
      return action["do"](brave).should.be.an["instanceof"](Object);
    });
    it('should failure action every time', function() {
      return action["do"](brave).isSucceed.should.not.be.ok;
    });
    it('should set null to brave.action', function() {
      action["do"](brave);
      return should.not.exist(brave.action);
    });
    it('should set 0.0 to brave.actionProcess', function() {
      action["do"](brave);
      return brave.actionProcess.should.equal(0);
    });
    return it('should not have next action', function() {
      action["do"](brave);
      return should.not.exist(brave.action);
    });
  });
  describe('#after()', function() {
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
  return describe('#details()', function() {
    return it('should return action details', function() {
      var details;
      details = action.details();
      should.exist(details);
      details.should.be.an["instanceof"](Object);
      should.not.exist(details.name, 'name should not exist');
      return details.time.should.equal(0);
    });
  });
});

describe('WaitAction', function() {
  var action, spot;
  spot = new Spot('testSpot', 0, 0, [
    {
      type: 'wait',
      time: 3000
    }
  ]);
  action = new WaitAction(5000);
  it('should have name', function() {
    return action.name.should.equal('wait');
  });
  it('should have time', function() {
    return action.time.should.equal(5000);
  });
  describe('#do()', function() {
    var brave;
    brave = new Brave('testBrave', spot);
    beforeEach(function() {
      brave.action = 'dummy';
      return brave.actionProcess = 0.5;
    });
    it('should return Object', function() {
      return action["do"](brave).should.be.an["instanceof"](Object);
    });
    it('should success action every time', function() {
      return action["do"](brave).isSucceed.should.be.ok;
    });
    it('should select next action from spot', function() {
      action["do"](brave);
      brave.action.name.should.equal('wait');
      return brave.action.time.should.equal(3000);
    });
    return it('should have next action', function() {
      action["do"](brave);
      return should.exist(brave.action);
    });
  });
  return describe('#details()', function() {
    return it('should return action details', function() {
      var details;
      details = action.details();
      should.exist(details);
      details.should.be.an["instanceof"](Object);
      should.exist(details.name, 'name should exist');
      details.name.should.equal('wait');
      should.exist(details.time, 'time should exist');
      return details.time.should.equal(5000);
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
  describe('#do()', function() {
    var brave;
    brave = new Brave('testBrave', fromSpot);
    beforeEach(function() {
      brave.action = 'dummy';
      return brave.spot = fromSpot;
    });
    it('should return Object', function() {
      return action["do"](brave).should.be.an["instanceof"](Object);
    });
    it('should success action every time', function() {
      return action["do"](brave).isSucceed.should.be.ok;
    });
    it('should set @to to brave.spot', function() {
      action["do"](brave);
      return brave.spot.name.should.equal('to');
    });
    it('should select next action from @to', function() {
      action["do"](brave);
      brave.action.name.should.equal('wait');
      return brave.action.time.should.equal(5000);
    });
    return it('should have next action', function() {
      action["do"](brave);
      return should.exist(brave.action);
    });
  });
  return describe('#details()', function() {
    return it('should return action details', function() {
      var details;
      details = action.details();
      should.exist(details);
      details.should.be.an["instanceof"](Object);
      should.exist(details.name, 'name should exist');
      details.name.should.equal('move');
      should.exist(details.time, 'time should exist');
      details.time.should.equal(1000);
      should.exist(details.from, 'from should exist');
      details.from.should.equal(fromSpot.id);
      should.exist(details.to, 'to should exist');
      return details.to.should.equal(toSpot.id);
    });
  });
});

describe('SearchAction', function() {
  var action, spot;
  spot = new Spot('testSpot', 0, 0, [
    {
      type: 'wait',
      time: 3000
    }
  ]);
  action = new SearchAction(3000, {});
  it('should have name', function() {
    return action.name.should.equal('search');
  });
  it('should have time', function() {
    return action.time.should.equal(3000);
  });
  it('should have probabilityMax', function() {
    return action.probabilityMax.should.equal(1000);
  });
  it('should have treasureDict', function() {
    return action.treasureDict.should.be.an["instanceof"](Object);
  });
  describe('#do()', function() {
    var brave, goodKinoko, kinoko, tikuwa;
    kinoko = SharedItemCreator.createItem(1);
    goodKinoko = SharedItemCreator.createItem(2);
    tikuwa = SharedItemCreator.createItem(3);
    brave = new Brave('testBrave', spot);
    beforeEach(function() {
      brave.action = 'dummy';
      return brave.items = [];
    });
    it('should return Object', function() {
      return action["do"](brave).should.be.an["instanceof"](Object);
    });
    it('should return false over probabilityMax', function() {
      var failureAction, result, treasureDict;
      treasureDict = {};
      treasureDict[kinoko.id] = {
        item: kinoko,
        probability: 500
      };
      treasureDict[goodKinoko.id] = {
        item: goodKinoko,
        probability: 500
      };
      treasureDict[tikuwa.id] = {
        item: tikuwa,
        probability: 500
      };
      failureAction = new SearchAction(3000, treasureDict);
      result = failureAction["do"](brave);
      return result.isSucceed.should.not.be.ok;
    });
    it('should add item to brave', function() {
      var result, successAction, treasureDict;
      treasureDict = {};
      treasureDict[kinoko.id] = {
        item: kinoko,
        probability: 1000
      };
      successAction = new SearchAction(3000, treasureDict);
      result = successAction["do"](brave);
      result.isSucceed.should.be.ok;
      brave.items.should.include(kinoko);
      return result.treasure.should.equal(kinoko);
    });
    it('should return false if brave failed to get item', function() {
      var failure, i, randomAction, result, success, treasureDict;
      treasureDict = {};
      treasureDict[kinoko.id] = {
        item: kinoko,
        probability: 500
      };
      success = 0;
      failure = 0;
      randomAction = new SearchAction(3000, treasureDict);
      for (i = 1; i <= 50; i++) {
        brave.items = [];
        result = randomAction["do"](brave);
        if (result.treasure) {
          result.isSucceed.should.be.ok;
          success += 1;
        } else {
          result.isSucceed.should.not.be.ok;
          failure += 1;
        }
      }
      success.should.above(10);
      return failure.should.above(10);
    });
    it('should return false if brave cannot take a getting item', function() {
      var failureAction, result, treasureDict;
      treasureDict = {};
      treasureDict[kinoko.id] = {
        item: kinoko,
        probability: 1000
      };
      failureAction = new SearchAction(3000, treasureDict);
      brave.items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      result = failureAction["do"](brave);
      result.isSucceed.should.not.be.ok;
      return result.treasure.should.equal(kinoko);
    });
    return it('should have next action', function() {
      action["do"](brave);
      return should.exist(brave.action);
    });
  });
  return describe('#details()', function() {
    return it('should return action details', function() {
      var details;
      details = action.details();
      should.exist(details);
      details.should.be.an["instanceof"](Object);
      should.exist(details.name, 'name should exist');
      details.name.should.equal('search');
      should.exist(details.time, 'time should exist');
      return details.time.should.equal(3000);
    });
  });
});
