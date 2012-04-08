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
        dungeonList: [
            {
                name: "なめこの洞窟"
                floorList: [
                    [
                        {
                            type: "search"
                            treasureList: [
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
    
    it 'should have dungeonList', ->
        simulator.dungeonList.should.be.an.instanceof Array
        simulator.dungeonList.should.empty
    
    it 'should have braveList', ->
        simulator.braveList.should.be.an.instanceof Array
        simulator.braveList.should.empty
    
    it 'should have jobs', ->
        should.not.exist simulator.jobs
    
    describe '#start()', ->
        
        beforeEach ->
            simulator = new Simulator
            
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
        
        it 'should make dungeonList', ->
            simulator.dungeonList.should.empty
            simulator.start config
            simulator.dungeonList.should.not.empty
            simulator.dungeonList.length.should.equal 1
            simulator.dungeonList[0].name.should.equal "なめこの洞窟"
        
        it 'should make braveList', ->
            simulator.braveList.should.empty
            simulator.start config
            simulator.braveList.should.not.empty
            simulator.braveList.length.should.equal 10
        
        it 'should make kue jobs', ->
            should.not.exist simulator.jobs
            
            simulator.start config
            
            should.exist simulator.jobs
    
    describe '#dungeonForName()', ->
        
        beforeEach ->
            simulator.dungeonList = [
                new Dungeon {name: 'hoge'}
                new Dungeon {name: 'fuga'}
                new Dungeon {name: 'piyo'}
            ]
        
        it 'should return null if dungeon not found', ->
            dungeon = simulator.dungeonForName 'foo'
            should.not.exist dungeon
        
        it 'should return dungeon if dungeon found', ->
            dungeon = simulator.dungeonForName 'hoge'
            should.exist dungeon
            
            dungeon.should.be.an.instanceof Dungeon
            dungeon.name.should.equal 'hoge'
    
    describe '#braveForName()', ->
        
        beforeEach ->
            simulator.braveList = [
                new Brave 'hoge'
                new Brave 'fuga'
                new Brave 'piyo'
            ]
        
        it 'should return null if brave not found', ->
            brave = simulator.braveForName 'foo'
            should.not.exist brave
            
        it 'should return brave if brave found', ->
            brave = simulator.braveForName 'hoge'
            should.exist brave
            
            brave.should.be.an.instanceof Brave
            brave.name.should.equal 'hoge'
