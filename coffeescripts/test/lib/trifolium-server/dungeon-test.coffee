should = require 'should'

library = if process.env['TRIFOLIUM_COV'] then 'lib-cov' else 'lib'
serverLibPath = "../../../#{library}/trifolium-server"
{Floor, Dungeon} = require "#{serverLibPath}/dungeon"

describe 'Floor', ->
    floor = null
    
    describe '#createEvent()', ->
        
    
    describe '#pickEvent()', ->
        beforeEach ->
            floor = new Floor {_id: 'floorA', number: 1, events: [
                            type: "search"
                            treasures: [
                                {
                                    "itemId": 2,
                                    "probability": 100
                                }
                            ]
                        ]}
        
        it 'should return null if floor has no event', ->
            floor.events = []
            event = floor.pickEvent()
            should.not.exist event
        
        it 'should return Event', ->
            event = floor.pickEvent()
            should.exist event

describe 'Dungeon', ->
    dungeon = null
    
    beforeEach ->
        dungeon = new Dungeon
            _id: 'dungeonId'
            name: 'testDungeon'
            floors: []
    
    it 'should have name', ->
        dungeon.name.should.equal 'testDungeon'
    
    it 'should have id', ->
        dungeon.id.should.equal 'dungeonId'
    
    it 'should have floors', ->
        dungeon.floors.should.be.an.instanceof Array
