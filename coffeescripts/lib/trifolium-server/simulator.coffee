{EventEmitter} = require 'events'
kue = require 'kue'
{ItemCreator} = require './item'
{BraveCreator} = require './brave'
{Dungeon} = require "./dungeon"
{SearchEvent} = require './event'

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
        @jobs.process 'searchEvent', numBraves, (job, done) -> done()
        @jobs.on 'job complete', (id) ->
            kue.Job.get id, (err, job) ->
                return if err
                job.remove (err) -> throw err if err
        @jobs.promote 100
        
        for brave in @braveList
            treasureList = [
                {itemId: 1, probability: 400}
                {itemId: 2, probability: 100}
            ]
            time = 10000
            
            simulator = @
            job = @jobs.create('searchEvent',
                treasureList: treasureList
                braveId: brave.id
                
            ).on('complete', ->
                console.log @data
                brave = simulator.braveForId @data.braveId
                event = new SearchEvent @data.treasureList
                result = event.process brave
                
                simulator.emit 'completeSearchEvent', brave, event, result
            ).delay(time).save()
    
    dungeonForId: (id) ->
        (dungeon for dungeon in @dungeonList when dungeon.id == id)[0]
    
    braveForId: (id) ->
        (brave for brave in @braveList when brave.id == id)[0]
    
exports.Simulator = Simulator