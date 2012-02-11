vows = require 'vows'
assert = require 'assert'
Spot = require('../../../lib/trifolium/spot').Spot
{Action, WaitAction, MoveAction, SearchAction} = require '../../../lib/trifolium/action'

vows.describe('Spot').addBatch
    'a instance':
        topic: new Spot('testSpot', 0, 0, [
                    {type: 'wait', time: 3000}
                    {type: 'wait', time: 4000}
                    {type: 'wait', time: 5000}
                ])
        'hasName': (spot) ->
            assert.equal(spot.name, 'testSpot')
        'hasPosX': (spot) ->
            assert.equal(spot.posX, 0)
        'hasPosY': (spot) ->
            assert.equal(spot.posY, 0)
        'hasActions': (spot) ->
            assert.isArray(spot.actions)
            assert.instanceOf(spot.actions[0], WaitAction)
        'selectRandomAction': (spot) ->
            action = spot.randomAction()
            assert.instanceOf(action, WaitAction)
            assert.strictEqual(3000 <= action.time <= 5000, true)
        'distanceBetweenAnother': (spot) ->
            another = new Spot('another', 50, 0)
            assert.equal(spot.distance(another), 50)
            another = new Spot('another', 0, 50)
            assert.equal(spot.distance(another), 50)
            another = new Spot('another', 30, 40)
            assert.equal(spot.distance(another), 50)
.export module
