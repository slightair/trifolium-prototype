{EventEmitter} = require 'events'
kue = require 'kue'

{ItemCreator} = require './item'
{BraveCreator} = require './brave'
{Dungeon} = require "./dungeon"
{EventProcess} = require './event'

class Simulator extends EventEmitter
    constructor : ->
        @dungeonList = []
        @braveList = []
        @jobs = null
    
    start: (config) ->
        {dungeonList, braveNameDict, numBraves, itemDict} = config
        
        ItemCreator.setItemDict itemDict
        BraveCreator.setBraveNameDict braveNameDict
        
        @dungeonList = (new Dungeon dungeonInfo for dungeonInfo in dungeonList)
        @braveList = (BraveCreator.create {speed: Math.floor(Math.random() * 50) + 20} for i in [0...numBraves])
        
        @jobs = kue.createQueue()
        @jobs.process 'event', EventProcess
    
    dungeonForName: (name) ->
        (dungeon for dungeon in @dungeonList when dungeon.name == name)[0]
    
    braveForName: (name) ->
        (brave for brave in @braveList when brave.name == name)[0]
    
exports.Simulator = Simulator