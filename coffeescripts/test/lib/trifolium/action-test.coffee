should = require 'should'
{Brave} = require '../lib/trifolium/brave'
{Spot} = require '../lib/trifolium/spot'
{Action, WaitAction, MoveAction, SearchAction} = require '../lib/trifolium/action'

describe 'Action', ->
    action = new Action
    
    it 'should have no name', ->
        should.not.exist action.name
    
    it 'should have time', ->
        action.time.should.equal 0
    
    describe '#do()', ->
        spot = new Spot 'testSpot', 0, 0
        brave = new Brave 'testBrave', spot
        
        beforeEach ->
            brave.listeners = []
            brave.action = 'dummy'
            brave.actionProcess = 0.5
        
        it 'should return false', ->
            (action.do brave).should.be.false
        
        it 'should set null to brave.action', ->
            action.do brave
            should.not.exist brave.action
        
        it 'should set 0.0 to brave.actionProcess', ->
            action.do brave
            brave.actionProcess.should.equal 0
    
    describe '#after()', ->
        nextAction = new Action
        spot = new Spot 'testSpot', 0, 0
        brave = new Brave 'testBrave', spot
        
        beforeEach ->
            nextAction.prepare = ->
            brave.action = 'dummy'
        
        it 'should call nextAction.prepare()', (done) ->
            nextAction.prepare = (brave) ->
                done()
            action.after brave, nextAction
        
        it 'should set nextAction to brave.action', ->
            action.after brave, nextAction
            brave.action.should.not.equal 'dummy'
            brave.action.should.equal nextAction
        
        it 'should set same spot to brave.destination', ->
            action.after brave, nextAction
            brave.destination.should.equal spot
        
        it 'should set destination to brave.destination', ->
            fromSpot = new Spot 'from', 10, 10
            toSpot = new Spot 'to', 20, 20
            moveAction = new MoveAction fromSpot, toSpot
            
            action.after brave, moveAction
            brave.destination.should.equal toSpot

describe 'WaitAction', ->
    action = new WaitAction 5000
    
    it 'should have name', ->
        action.name.should.equal 'wait'
    
    it 'should have time', ->
        action.time.should.equal 5000
    
    describe '#do()', ->
        spot = new Spot 'testSpot', 0, 0, [
            {type: 'wait', time: 3000}
        ]
        brave = new Brave 'testBrave', spot
        
        beforeEach ->
            brave.action = 'dummy'
            brave.actionProcess = 0.5
        
        it 'should return true', ->
            (action.do brave).should.be.true
        
        it 'should select next action from spot', ->
            action.do brave
            brave.action.name.should.equal 'wait'
            brave.action.time.should.equal 3000

describe 'MoveAction', ->
    fromSpot = new Spot 'from', 10, 10, [
        {type: 'wait', time: 3000}
    ]
    toSpot = new Spot 'to', 10, 20, [
        {type: 'wait', time: 5000}
    ]
    action = new MoveAction fromSpot, toSpot
    
    it 'should have name', ->
        action.name.should.equal 'move'
    
    it 'should have from', ->
        action.from.name.should.equal 'from'
    
    it 'should have to', ->
        action.to.name.should.equal 'to'
    
    it 'should have time', ->
        action.time.should.equal 1000
    
    describe '#do()', ->
        brave = new Brave 'testBrave', fromSpot
        
        beforeEach ->
            brave.action = 'dummy'
            brave.spot = fromSpot
        
        it 'should return true', ->
            (action.do brave).should.be.true
        
        it 'should set @to to brave.spot', ->
            action.do brave
            brave.spot.name.should.equal 'to'
        
        it 'should select next action from @to', ->
            action.do brave
            brave.action.name.should.equal 'wait'
            brave.action.time.should.equal 5000

describe 'SearchAction', ->
    action = new SearchAction 3000,
        'kinoko': 500
        'banana': 300
        'apple': 200
    
    it 'should have name', ->
        action.name.should.equal 'search'
    
    it 'should have time', ->
        action.time.should.equal 3000
    
    it 'should have probabilityMax', ->
        action.probabilityMax.should.equal 1000
    
    it 'should have tresureDict', ->
        action.treasureDict.should.be.an.instanceof Object
    
    it 'should not have tresure', ->
        should.not.exist action.treasure
    
    describe '#do()', ->
        brave = new Brave 'testBrave', new Spot 'testSpot', 10, 10
        
        beforeEach ->
            brave.items = []
        
        it 'should return false over probabilityMax', ->
            failureAction = new SearchAction 3000,
                'kinoko': 500
                'banana': 500
                'apple': 500
            
            result = failureAction.do brave
            result.should.not.be.ok
        
        it 'should add item to brave', ->
            successAction = new SearchAction 3000,
                'kinoko': 1000
            
            result = successAction.do brave
            result.should.be.ok
            brave.items.should.include 'kinoko'
            successAction.treasure.should.equal 'kinoko'
        
        it 'should return false if brave failed to get item', ->
            success = 0
            failure = 0
            
            for i in [1..50]
                randomAction = new SearchAction 3000,
                    'kinoko': 500
                brave.items = []
                
                result = randomAction.do brave
                if randomAction.treasure
                    result.should.be.ok
                    success += 1
                else
                    result.should.not.be.ok
                    failure += 1
            
            success.should.above 10
            failure.should.above 10
        
        it 'should return false if brave cannot take a getting item', ->
            failureAction = new SearchAction 3000,
                'kinoko': 1000
            
            brave.items = [1..10]
            result = failureAction.do brave
            result.should.not.be.ok
            failureAction.treasure.should.equal 'kinoko'
