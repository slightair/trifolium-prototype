should = require 'should'
fs = require 'fs'

serverLibPath = '../../../lib/trifolium-server'
{Dungeon} = require "#{serverLibPath}/dungeon"
{SearchEvent, SerchEventProcess} = require "#{serverLibPath}/event"

configFile = './config.json'
config = JSON.parse(fs.readFileSync(configFile))

describe 'Dungeon', ->
    dungeon = null
    
    beforeEach ->
        dungeon = new Dungeon
            name: 'testDungeon'
            floors: []
    
    it 'should have name', ->
        dungeon.name.should.equal 'testDungeon'
    
    it 'should have floors', ->
        dungeon.floors.should.be.an.instanceof Array
    
    describe '#pickEvent', ->
        beforeEach ->
            dungeon = new Dungeon
                name: 'testDungeon'
                floors: [
                    [1, 2, 3]
                    [4, 5, 6]
                    [7, 8, 9]
                ]
        
        it 'should return null if invalid floor', ->
            event = dungeon.pickEvent 4
            should.not.exist event
        
        it 'should return Event', ->
            event = dungeon.pickEvent 1
            should.exist event
            event.should.be.within(4, 6)
