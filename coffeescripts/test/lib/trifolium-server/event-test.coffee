should = require 'should'

library = if process.env['TRIFOLIUM_COV'] then 'lib-cov' else 'lib'
serverLibPath = "../../../#{library}/trifolium-server"
{Brave} = require "#{serverLibPath}/brave"
{SearchEvent} = require "#{serverLibPath}/event"

describe 'SearchEvent', ->
    event = null
    
    beforeEach ->
        event = new SearchEvent []
    
    it 'should have type', ->
        event.type.should.equal 'search'
    
    it 'should have treasureList', ->
        event.treasureList.should.be.an.instanceof Array
    
    describe '#process()', ->
        brave = null
        
        beforeEach ->
            brave = new Brave 'testBrave'
        
        it 'should return false over probabilityMax', ->
            treasureList = [
                {itemId: '1', probability: 500}
                {itemId: '2', probability: 500}
                {itemId: '3', probability: 500}
            ]
            
            event = new SearchEvent treasureList
            result = event.process brave
            result.isSucceed.should.not.be.ok
        
        it 'should add item to brave', ->
            treasureList = [
                {itemId: '1', probability: 1000}
            ]
            
            event = new SearchEvent treasureList
            
            result = event.process brave
            result.isSucceed.should.be.ok
            brave.items.should.include result.treasure
        
        it 'should return false if brave failed to get item', ->
            treasureList = [
                {itemId: '1', probability: 400}
                {itemId: '2', probability: 100}
            ]
            
            success = 0
            failure = 0
            
            event = new SearchEvent treasureList
            
            for i in [1..50]
                brave.items = []
                
                result = event.process brave
                if result.treasure
                    result.isSucceed.should.be.ok
                    success += 1
                else
                    result.isSucceed.should.not.be.ok
                    failure += 1
            
            success.should.above 10
            failure.should.above 10
        
        it 'should return false if brave cannot take a getting item', ->
            treasureList = [
                {itemId: '1', probability: 1000}
            ]
            
            event = new SearchEvent treasureList
            
            brave.items = [1..10]
            result = event.process brave
            result.isSucceed.should.not.be.ok
            brave.items.should.not.include result.treasure
