{Spot} = require '../lib/trifolium/spot'
{Action, WaitAction, MoveAction, SearchAction} = require '../lib/trifolium/action'

describe "Spot", ->
    spot = new Spot 'testSpot', 0, 0, [
        {type: 'wait', time: 3000}
        {type: 'wait', time: 4000}
        {type: 'wait', time: 5000}
    ]
        
    it 'should have name', ->
        spot.name.should.equal('testSpot')
    it 'should have posX', ->
        spot.posX.should.equal(0)
    it 'should have posY', ->
        spot.posY.should.equal(0)
    it 'should have actions', ->
        spot.actions.should.be.an.instanceof(Array)
        spot.actions[0].should.be.an.instanceof(WaitAction)
    it 'should be return a random action', ->
        action = spot.randomAction()
        action.should.be.an.instanceof(WaitAction)
        action.time.should.be.within(3000, 5000)
    it 'should be return distance between another spot', ->
        another = new Spot 'another', 100, 0
        spot.distance(another).should.equal(100)
            
        another = new Spot 'another', 0, 20
        spot.distance(another).should.equal(20)
            
        another = new Spot 'another', 30, 40
        spot.distance(another).should.equal(50)
