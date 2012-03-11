should = require 'should'

serverLibPath = '../../../lib/trifolium-server'
{Brave} = require "#{serverLibPath}/brave"
{Spot} = require "#{serverLibPath}/spot"
{WaitAction} = require "#{serverLibPath}/action"
{Item} = require "#{serverLibPath}/item"

describe 'Brave', ->
    spot = new Spot 'testSpot', 0, 0, [
        {type: 'wait', time: 5000}
    ]
    brave = new Brave 'testBrave', spot
    
    it 'should have id', ->
        should.exist brave.id
    
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
    
    it 'should have items', ->
        brave.items.should.be.an.instanceof Array
        brave.items.should.be.empty
    
    it 'should have gold', ->
        brave.gold.should.equal 300
    
    describe '#tick()', ->
        
        beforeEach ->
            brave.action = new WaitAction 3000
            brave.actionProcess = 0.0
        
        it 'should be added actionProcess', ->
            brave.tick()
            brave.actionProcess.should.be.within 0.000, 0.002
            
            brave.tick()
            brave.actionProcess.should.be.within 0.001, 0.003
        
        it 'should emit \'completeAction\'', (done) ->
            brave.on 'completeAction', (brave, action, result) ->
                action.time.should.equal 3000
                done()
            
            brave.tick()
            brave.actionProcess.should.be.within 0.000, 0.002
            
            brave.tick()
            brave.actionProcess.should.be.within 0.001, 0.003
            
            brave.tick() for i in [3...999]
            
            brave.tick()
            brave.actionProcess.should.be.within 0.998, 1.000
            
            brave.tick() # => emit 'completeAction'
    
    describe '#addItem()', ->
        
        beforeEach ->
            brave.items = []
        
        it 'should add an item', ->
            item = new Item
            
            brave.items.should.be.empty
            result = brave.addItem item
            brave.items.should.include item
            result.should.be.ok
        
        it 'should not add item over 10 items', ->
            brave.addItem new Item for i in [0...10]
            brave.items.should.have.length 10
            result = brave.addItem new Item
            result.should.not.be.ok
            brave.items.should.have.length 10
    
    describe '#removeItem()', ->
        item = new Item
        
        beforeEach ->
            brave.items = [item]
        
        it 'should remove an item', ->
            brave.items.should.not.be.empty
            brave.items.should.include item
            brave.removeItem item
            brave.items.should.not.include item
            brave.items.should.be.empty
        
        it 'should not remove no include item', ->
            another = new Item
            
            brave.items.should.not.be.empty
            brave.items.should.include(item)
            brave.items.should.not.include(another)
            brave.removeItem another
            brave.items.should.not.be.empty
            brave.items.should.include(item)
            brave.items.should.not.include(another)

    