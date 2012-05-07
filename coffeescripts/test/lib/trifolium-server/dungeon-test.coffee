should = require 'should'

library = if process.env['TRIFOLIUM_COV'] then 'lib-cov' else 'lib'
serverLibPath = "../../../#{library}/trifolium-server"
{Floor, Dungeon} = require "#{serverLibPath}/dungeon"

describe 'Floor', ->
    floor = null
    
    describe '#pickEventInfo()', ->
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
            eventInfo = floor.pickEventInfo()
            should.not.exist eventInfo
        
        it 'should return eventInfo', ->
            eventInfo = floor.pickEventInfo()
            should.exist eventInfo
            eventInfo.type.should.equal "search"

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
