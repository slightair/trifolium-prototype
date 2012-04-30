should = require 'should'

library = if process.env['TRIFOLIUM_COV'] then 'lib-cov' else 'lib'
serverLibPath = "../../../#{library}/trifolium-server"
{Simulator} = require "#{serverLibPath}/simulator"
{ItemCreator} = require "#{serverLibPath}/item"
{Brave, BraveCreator} = require "#{serverLibPath}/brave"
{Dungeon} = require "#{serverLibPath}/dungeon"

describe 'Simulator', ->
    simulator = null
    config = {
        numBraves: 10
        braveNameDict: {
            terms: ['1', '2', '3']
            prefixes: ['A', 'B', 'C']
            suffixes: ['a', 'b', 'c']
        }
        itemDict: {
            1: {name: 'きのこ'}
            2: {name: 'ちくわ'}
            3: {name: 'いいちくわ'}
        }
    }
    
    beforeEach ->
        simulator = new Simulator
    
    it 'should have dungeons', ->
        simulator.dungeons.should.be.an.instanceof Array
        simulator.dungeons.should.empty
    
    it 'should have braves', ->
        simulator.braves.should.be.an.instanceof Array
        simulator.braves.should.empty
    
    it 'should have jobs', ->
        should.exist simulator.jobs
    
    describe '#dungeonForId()', ->
        dungeonA = new Dungeon {name: 'hoge', floors:[]}
        dungeonB = new Dungeon {name: 'fuga', floors:[]}
        dungeonC = new Dungeon {name: 'piyo', floors:[]}
        dungeonId = dungeonA.id
        
        beforeEach ->
            simulator.dungeons = [
                dungeonA
                dungeonB
                dungeonC
            ]
        
        it 'should return null if dungeon not found', ->
            dungeon = simulator.dungeonForId 'unknownId'
            should.not.exist dungeon
        
        it 'should return dungeon if dungeon found', ->
            dungeon = simulator.dungeonForId dungeonId
            should.exist dungeon
            
            dungeon.should.be.an.instanceof Dungeon
            dungeon.name.should.equal 'hoge'
    
    describe '#braveForId()', ->
        braveA = new Brave 'hoge'
        braveB = new Brave 'fuga'
        braveC = new Brave 'piyo'
        braveId = braveA.id
        
        beforeEach ->
            simulator.braves = [
                braveA
                braveB
                braveC
            ]
        
        it 'should return null if brave not found', ->
            brave = simulator.braveForId 'unknownId'
            should.not.exist brave
            
        it 'should return brave if brave found', ->
            brave = simulator.braveForId braveId
            should.exist brave
            
            brave.should.be.an.instanceof Brave
            brave.name.should.equal 'hoge'
