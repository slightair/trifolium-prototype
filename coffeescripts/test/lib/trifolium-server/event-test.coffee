should = require 'should'

library = if process.env['TRIFOLIUM_COV'] then 'lib-cov' else 'lib'
serverLibPath = "../../../#{library}/trifolium-server"
{Brave} = require "#{serverLibPath}/brave"
{SearchEvent, SearchEventProcess} = require "#{serverLibPath}/event"

describe 'SearchEvent', ->
    event = null
    
    beforeEach ->
        brave = new Brave 'testBrave'
        event = new SearchEvent brave, 3000, []
    
    it 'should have type', ->
        event.type.should.equal 'search'
    
    it 'should have time', ->
        event.time.should.equal 3000
    
    it 'should have treasureList', ->
        event.treasureList.should.be.an.instanceof Array
    
describe 'SearchEventProcess', ->
    brave = null
        
    beforeEach ->
        brave = new Brave 'testBrave'
    
    it 'should call done', (done) ->
        job = {
            data: new SearchEvent brave, 1000
        }
        SearchEventProcess job, done
    
    it 'should return false over probabilityMax', ->
        treasureList = [
            {itemId: '1', probability: 500}
            {itemId: '2', probability: 500}
            {itemId: '3', probability: 500}
        ]
        
        job = {
            data: new SearchEvent brave, 3000, treasureList
        }
        result = SearchEventProcess job, -> null
        result.isSucceed.should.not.be.ok
    
    it 'should add item to brave', ->
        treasureList = [
            {itemId: '1', probability: 1000}
        ]
        
        job = {
            data: new SearchEvent brave, 3000, treasureList
        }
        
        result = SearchEventProcess job, -> null
        result.isSucceed.should.be.ok
        brave.items.should.include result.treasure
    
    it 'should return false if brave failed to get item', ->
        treasureList = [
            {itemId: '1', probability: 400}
            {itemId: '2', probability: 100}
        ]
        
        success = 0
        failure = 0
        
        job = {
            data: new SearchEvent brave, 3000, treasureList
        }
        
        for i in [1..50]
            brave.items = []
            
            result = SearchEventProcess job, -> null
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
        
        job = {
            data: new SearchEvent brave, 3000, treasureList
        }
        
        brave.items = [1..10]
        result = SearchEventProcess job, -> null
        result.isSucceed.should.not.be.ok
        brave.items.should.not.include result.treasure
    