{EventEmitter} = require 'events'
kue = require 'kue'

{BraveCreator} = require './brave'
{ItemCreator} = require './item'
{eventProcess} = require './event'

class Simulator extends EventEmitter
    constructor : ->
        @dungeonList = []
        @braveList = []
    
    start: (config) ->
        {dungeonList, braveNameDict, numBraves, itemDict} = config
        
        braveCreator.setBraveNameDict braveNameDict
        ItemCreator.setItemDict itemDict
        
        @dungeonList = (new Dungeon dungeonInfo for dungeonInfo in dungeonInfoList)
        
        @braveList = (new Brave(@makeBraveName(braveNameDictionary), spawnSpot, {speed: Math.floor(Math.random() * 50) + 20}) for i in [0...numBraves])
        
        @jobs = kue.createQueue()
        @jobs.process 'event', eventProcess
    
    dungeonForName: (name) ->
        (dungeon for dungeon in @dungeonList when dungeon.name == name)[0]
    
    braveForName: (name) ->
        (brave for brave in @braveList when brave.name == name)[0]
    
exports.Simulator = Simulator