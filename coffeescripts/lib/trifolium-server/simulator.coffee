{EventEmitter} = require 'events'
kue = require 'kue'

{DungeonModel} = require '../database'
{ItemCreator} = require './item'
{BraveCreator} = require './brave'
{Dungeon} = require "./dungeon"
{SearchEvent} = require './event'
{step} = require '../util'

class Simulator extends EventEmitter
    constructor : ->
        @dungeons = []
        @braves = []
        @jobs = kue.createQueue()
    
    start: (config) ->
        {braveNameDict, numBraves, itemDict} = config
        
        ItemCreator.setItemDict itemDict
        BraveCreator.setBraveNameDict braveNameDict
        
        step [
            (done) => @makeDungeons done
            (done) => @makeBraves numBraves, done
        ], =>
            if @jobs
                @jobs.process 'searchEvent', numBraves, (job, done) -> done()
                @jobs.on 'job complete', (id) ->
                    kue.Job.get id, (err, job) ->
                        return if err
                        job.remove (err) -> throw err if err
                @jobs.promote 100
                
                for brave in @braves
                    dungeon = @dungeons[0]
                    eventInfo = dungeon.floors[0].pickEventInfo()
                    time = 10000
                    
                    simulator = @
                    job = @jobs.create('searchEvent',
                        treasures: eventInfo.treasures
                        braveId: brave.id
                    ).on('complete', ->
                        brave = simulator.braveForId @data.braveId
                        event = new SearchEvent @data.treasures
                        result = event.process brave
                        
                        simulator.emit 'completeSearchEvent', brave, event, result
                    ).delay(time).save()
    
    makeDungeons: (done) ->
        DungeonModel.find {}, (err, dungeons) =>
            @dungeons = (new Dungeon dungeonInfo for dungeonInfo in dungeons)
            done()
    
    makeBraves: (numBraves, done) ->
        @braves = (BraveCreator.create {speed: Math.floor(Math.random() * 50) + 20} for i in [0...numBraves])
        done()
    
    dungeonForId: (id) ->
        (dungeon for dungeon in @dungeons when dungeon.id == id)[0]
    
    braveForId: (id) ->
        (brave for brave in @braves when brave.id == id)[0]
    
exports.Simulator = Simulator