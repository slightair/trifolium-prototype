var Spot, assert, vows;

vows = require('vows');

assert = require('assert');

Spot = require('../../../lib/trifolium/spot.js').Spot;

vows.describe('Spot').addBatch({
  'a instance': {
    topic: new Spot('testSpot', 0, 0, {
      type: 'wait',
      time: 3000
    }),
    'hasName': function(spot) {
      return assert.equal(spot.name, 'testSpot');
    },
    'hasPosX': function(spot) {
      return assert.equal(spot.posX, 0);
    },
    'hasPosY': function(spot) {
      return assert.equal(spot.posY, 0);
    }
  }
})["export"](module);
