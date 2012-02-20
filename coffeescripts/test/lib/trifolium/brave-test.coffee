should = require 'should'
{Brave} = require '../lib/trifolium/brave'
{Spot} = require '../lib/trifolium/spot'
{WaitAction} = require '../lib/trifolium/action'

describe 'Brave', ->
    spot = new Spot 'testSpot', 0, 0, [
        {type: 'wait', time: 5000}
    ]
    brave = new Brave 'testBrave', spot
    
    it 'should have name', ->
        brave.name.should.equal 'testBrave'
    
    it 'should have lv', ->
        brave.lv.should.equal 1
    
    it 'should have atk', ->
        brave.atk.should.equal 1
    
    it 'should have matk', ->
        brave.matk.should.equal 1
    
    it 'should have hp', ->
        brave.hp.should.equal 10
    
    it 'should have mp', ->
        brave.mp.should.equal 10
    
    it 'should have brave', ->
        brave.brave.should.equal 50
    
    it 'should have faith', ->
        brave.faith.should.equal 50
    
    it 'should have speed', ->
        brave.speed.should.equal 3
    
    it 'should have action', ->
        should.not.exist brave.action
    
    it 'should have actionProecss', ->
        brave.actionProcess.should.equal 0.0
    
    it 'should have spot', ->
        brave.spot.should.equal spot
    
    it 'should have destination', ->
        brave.destination.should.equal spot
    
    describe '#tick()', ->
        
        beforeEach ->
            brave.action = new WaitAction 3000
            brave.actionProcess = 0.0
        
        it 'should be added actionProcess', ->
            brave.tick()
            brave.actionProcess.should.be.within 0.000, 0.002
            
            brave.tick()
            brave.actionProcess.should.be.within 0.001, 0.003
        
        it 'should call @onCompleteAction()', (done) ->
            brave.onCompleteAction = (brave, action, isSucceed) ->
                action.time.should.equal 3000
                done()
            
            brave.tick()
            brave.actionProcess.should.be.within 0.000, 0.002
            
            brave.tick()
            brave.actionProcess.should.be.within 0.001, 0.003
            
            brave.tick() for i in [3...999]
            
            brave.tick()
            brave.actionProcess.should.be.within 0.998, 1.000
            
            brave.tick() # => call brave.onCompleteAction()
        