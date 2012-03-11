should = require 'should'

serverLibPath = '../../../lib/trifolium-server'
{Spot} = require "#{serverLibPath}/spot"
{WaitAction, SearchAction} = require "#{serverLibPath}/action"
{Item} = require "#{serverLibPath}/item"

describe "Spot", ->
    spot = new Spot 'testSpot', 0, 0, [
        {type: 'wait', time: 3000}
        {type: 'wait', time: 4000}
        {type: 'wait', time: 5000}
        {type: 'search', time: 5000, treasures: [
            {
                itemId: 1
                probability: 500
            }
            {
                itemId: 2
                name: '輝くきのこ'
                probability: 100
            }
        ]}
    ]
    
    it 'should have id', ->
        should.exist spot.id
    it 'should have name', ->
        spot.name.should.equal 'testSpot'
    it 'should have posX', ->
        spot.posX.should.equal 0
    it 'should have posY', ->
        spot.posY.should.equal 0
    it 'should have actions', ->
        spot.actions.should.be.an.instanceof Array
        
        waitActions = (action for action in spot.actions when action.name == 'wait')
        waitActions.should.not.empty
        waitActions[0].should.be.an.instanceof WaitAction
        
        searchActions = (action for action in spot.actions when action.name == 'search')
        searchActions.should.not.empty
        searchActions[0].should.be.an.instanceof SearchAction
    
    describe '#randomAction()', ->
        it 'should be return a random action', ->
            waitActionCount = 0
            searchActionCount = 0
            
            for i in [1..20]
                action = spot.randomAction()
                
                switch action.name
                    when 'wait'
                        action.should.be.an.instanceof WaitAction
                        action.time.should.be.within 3000, 5000
                        waitActionCount += 1
                    when 'search'
                        action.should.be.an.instanceof SearchAction
                        action.treasureDict.should.be.an.instanceof Object
                        for id, treasureInfo of action.treasureDict
                            item = treasureInfo.item
                            item.should.be.an.instanceof Item
                            switch item.itemId
                                when 1
                                    item.name.should.equal 'きのこ'
                                when 2
                                    item.name.should.equal '輝くきのこ'
                                else
                                    should.not.exist item, 'unknown item'
                        searchActionCount += 1
                    
                    else
                        action.name.should.not.be.an.instanceof Action, 'unknown action'
            
            waitActionCount.should.above 1, 'waitActionCount'
            searchActionCount.should.above 1, 'searchActionCount'
            (waitActionCount + searchActionCount).should.equal 20
    
    describe '#distance()', ->
        it 'should be return distance between another spot', ->
            another = new Spot 'another', 100, 0
            spot.distance(another).should.equal 100
            
            another = new Spot 'another', 0, 20
            spot.distance(another).should.equal 20
            
            another = new Spot 'another', 30, 40
            spot.distance(another).should.equal 50
