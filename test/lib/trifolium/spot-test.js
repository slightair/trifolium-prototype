var Action, MoveAction, SearchAction, Spot, WaitAction, assert, vows, _ref;

vows = require('vows');

assert = require('assert');

Spot = require('../../../lib/trifolium/spot').Spot;

_ref = require('../../../lib/trifolium/action'), Action = _ref.Action, WaitAction = _ref.WaitAction, MoveAction = _ref.MoveAction, SearchAction = _ref.SearchAction;

vows.describe('Spot').addBatch({
  'a instance': {
    topic: new Spot('testSpot', 0, 0, [
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
    ]),
    'hasName': function(spot) {
      return assert.equal(spot.name, 'testSpot');
    },
    'hasPosX': function(spot) {
      return assert.equal(spot.posX, 0);
    },
    'hasPosY': function(spot) {
      return assert.equal(spot.posY, 0);
    },
    'hasActions': function(spot) {
      assert.isArray(spot.actions);
      return assert.instanceOf(spot.actions[0], WaitAction);
    },
    'selectRandomAction': function(spot) {
      var action, _ref2;
      action = spot.randomAction();
      assert.instanceOf(action, WaitAction);
      return assert.strictEqual((3000 <= (_ref2 = action.time) && _ref2 <= 5000), true);
    },
    'distanceBetweenAnother': function(spot) {
      var another;
      another = new Spot('another', 50, 0);
      assert.equal(spot.distance(another), 50);
      another = new Spot('another', 0, 50);
      assert.equal(spot.distance(another), 50);
      another = new Spot('another', 30, 40);
      return assert.equal(spot.distance(another), 50);
    }
  }
})["export"](module);
