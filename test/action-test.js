var Action, Brave, MoveAction, SearchAction, Spot, WaitAction, should, _ref;

should = require('should');

Brave = require('../lib/trifolium/brave').Brave;

Spot = require('../lib/trifolium/spot').Spot;

_ref = require('../lib/trifolium/action'), Action = _ref.Action, WaitAction = _ref.WaitAction, MoveAction = _ref.MoveAction, SearchAction = _ref.SearchAction;

describe('Action', function() {
  var action;
  action = new Action();
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
      brave.action = 'dummy';
      return brave.actionProcess = 0.5;
    });
    it('should set null to brave.action', function() {
      action["do"](brave);
      return should.not.exist(brave.action);
    });
    it('should set 0.0 to brave.actionProcess', function() {
      action["do"](brave);
      return brave.actionProcess.should.equal(0);
    });
    return it('should call brave.doneAction()', function(done) {
      brave.addListener({
        completeBraveAction: function() {
          return done();
        }
      });
      return action["do"](brave);
    });
  });
  return describe('#after()', function() {
    it('should call nextAction.prepare()');
    it('should set nextAction to brave.action');
    return it('should set destination to brave.destination');
  });
});

describe('WaitAction', function() {
  var action;
  action = new WaitAction(5000);
  it('should have name', function() {
    return action.name.should.equal('wait');
  });
  return it('should have time', function() {
    return action.time.should.equal(5000);
  });
});
