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
        dungeons: [
            {
                name: "なめこの洞窟"
                floors: [
                    [
                        {
                            type: "search"
                            treasures: [
                                {
                                    "itemId": 2,
                                    "probability": 100
                                }
                            ]
                        }
                    ]
                ]
            }
        ]
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
    
    describe '#start()', ->
        
        beforeEach ->
            simulator = new Simulator
            simulator.jobs = null # for test
            
            ItemCreator.setItemDict {}
            BraveCreator.setBraveNameDict {
                terms: []
                prefixes: []
                suffixes: []
            }
        
        it 'should set ItemDict to ItemCreator', ->
            ItemCreator.itemDict.should.not.have.keys '1', '2', '3'
            
            simulator.start config
            
            ItemCreator.itemDict.should.have.keys '1', '2', '3'
            ItemCreator.itemDict['3'].name.should.equal 'いいちくわ'
        
        it 'should set braveNameDict to BraveCreator', ->
            BraveCreator.braveNamePrefixes.should.empty
            BraveCreator.braveNameSuffixes.should.empty
            
            simulator.start config
            
            BraveCreator.braveNamePrefixes.should.not.empty
            BraveCreator.braveNameSuffixes.should.not.empty
        
        it 'should make dungeons', ->
            simulator.dungeons.should.empty
            simulator.start config
            simulator.dungeons.should.not.empty
            simulator.dungeons.length.should.equal 1
            simulator.dungeons[0].name.should.equal "なめこの洞窟"
        
        it 'should make braves', ->
            simulator.braves.should.empty
            simulator.start config
            simulator.braves.should.not.empty
            simulator.braves.length.should.equal 10
    
    describe '#dungeonForId()', ->
        dungeonA = new Dungeon {name: 'hoge'}
        dungeonB = new Dungeon {name: 'fuga'}
        dungeonC = new Dungeon {name: 'piyo'}
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
