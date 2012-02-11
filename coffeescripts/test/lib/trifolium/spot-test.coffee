vows = require 'vows'
assert = require 'assert'
Spot = require('../../../lib/trifolium/spot.js').Spot

vows.describe('Spot').addBatch
    'a instance':
        topic: new Spot('testSpot', 0, 0,
            type: 'wait'
            time: 3000
        )
        'hasName': (spot) ->
            assert.equal(spot.name, 'testSpot')
        'hasPosX': (spot) ->
            assert.equal(spot.posX, 0)
        'hasPosY': (spot) ->
            assert.equal(spot.posY, 0)
.export module