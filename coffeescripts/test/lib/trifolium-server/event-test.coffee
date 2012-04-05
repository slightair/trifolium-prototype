should = require 'should'
fs = require 'fs'

serverLibPath = '../../../lib/trifolium-server'
{Brave} = require "#{serverLibPath}/brave"
{SearchEvent, SerchEventProcess} = require "#{serverLibPath}/event"
{ItemCreator} = require "#{serverLibPath}/item"

configFile = './config.json'
config = JSON.parse(fs.readFileSync(configFile))
ItemCreator.setItemDict config.simulator.itemDict

describe 'SearchEvent', ->
    event = null
    
    beforeEach ->
        brave = new Brave 'testBrave'
        event = new SearchEvent brave, 3000, {}
    
    it 'should have type', ->
        event.type.should.equal 'search'
    
    it 'should have time', ->
        event.time.should.equal 3000
    
    it 'should have probabilityMax', ->
        event.probabilityMax.should.equal 1000
    
    it 'should have treasureDict', ->
        event.treasureDict.should.be.an.instanceof Object
    
    describe '#process()', ->
        kinoko = ItemCreator.create 1
        goodKinoko = ItemCreator.create 2
        tikuwa = ItemCreator.create 3
        brave = null
        
        beforeEach ->
            brave = new Brave 'testBrave'
        
        it 'should return Object', ->
            event.process().should.be.an.instanceof Object
        
        it 'should return false over probabilityMax', ->
            treasureDict = {}
            treasureDict[kinoko.id] = {item: kinoko, probability: 500}
            treasureDict[goodKinoko.id] = {item: goodKinoko, probability: 500}
            treasureDict[tikuwa.id] = {item: tikuwa, probability: 500}
            
            failureEvent = new SearchEvent brave, 3000, treasureDict
            
            result = failureEvent.process()
            result.isSucceed.should.not.be.ok
        
        it 'should add item to brave', ->
            treasureDict = {}
            treasureDict[kinoko.id] = {item: kinoko, probability: 1000}
            
            successEvent = new SearchEvent brave, 3000, treasureDict
            
            result = successEvent.process()
            result.isSucceed.should.be.ok
            brave.items.should.include kinoko
            result.treasure.should.equal kinoko
        
        it 'should return false if brave failed to get item', ->
            treasureDict = {}
            treasureDict[kinoko.id] = {item: kinoko, probability: 500}
            
            success = 0
            failure = 0
            
            randomEvent = new SearchEvent brave, 3000, treasureDict
            for i in [1..50]
                brave.items = []
                
                result = randomEvent.process()
                if result.treasure
                    result.isSucceed.should.be.ok
                    success += 1
                else
                    result.isSucceed.should.not.be.ok
                    failure += 1
            
            success.should.above 10
            failure.should.above 10
        
        it 'should return false if brave cannot take a getting item', ->
            treasureDict = {}
            treasureDict[kinoko.id] = {item: kinoko, probability: 1000}
            
            failureEvent = new SearchEvent brave, 3000, treasureDict
            
            brave.items = [1..10]
            result = failureEvent.process()
            result.isSucceed.should.not.be.ok
            result.treasure.should.equal kinoko
    