should = require 'should'
{Brave} = require '../lib/trifolium/brave'
{Spot} = require '../lib/trifolium/spot'
{WaitAction} = require '../lib/trifolium/action'

describe 'Brave', ->
    spot = new Spot 'testSpot', 0, 0, [
        {type: 'wait', time: 5000}
    ]
    brave = new Brave 'testBrave', spot
    
    it 'should have listeners', ->
        brave.listeners.should.be.an.instanceof Array
        brave.listeners.should.be.empty
    
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
        
        it 'should be added actionProcess', ->
            result = brave.tick()
            brave.actionProcess.should.be.within 0.000, 0.002
            should.not.exist result
            
            result = brave.tick()
            brave.actionProcess.should.be.within 0.001, 0.003
            should.not.exist result
            
            brave.tick() for i in [3...999]
            
            result = brave.tick()
            brave.actionProcess.should.be.within 0.998, 1.000
            should.not.exist result
            
            result = brave.tick()
            result.should.equal true
        
        it 'should be return null when brave has no action', ->
            brave.action = null
            result = brave.tick()
            should.not.exist result
    
    describe '#addListener()', ->
        beforeEach ->
            brave.listeners = []
            
        it 'should push listener to listeners', ->
            listener = {name:'testListener'}
            
            brave.listeners.should.be.empty
            brave.addListener listener
            brave.listeners.should.have.length 1
            brave.listeners.should.include listener
    
    describe '#removeListener()', ->
        beforeEach ->
            brave.listeners = [
                {name:'listenerA'}
                {name:'listenerB'}
                {name:'listenerC'}
            ]
            
        it 'should remove listener from listeners', ->
            listener = {name:'testListener'}
            
            brave.addListener listener
            brave.listeners.should.have.length 4
            brave.listeners.should.include listener
            
            brave.removeListener listener
            brave.listeners.should.have.length 3
            brave.listeners.should.not.include listener
    
    describe '#doneAction()', ->
        
        beforeEach ->
            brave.listeners = []
        
        it 'should call each listeners #completeBraveAction()', (done) ->
            listener = {
                completeBraveAction: (brave, action) ->
                    done()
            }
            brave.addListener listener
            brave.doneAction 'action'
