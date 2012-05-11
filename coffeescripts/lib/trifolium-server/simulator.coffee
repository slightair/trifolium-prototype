{EventEmitter} = require 'events'
mongoose = require 'mongoose'
kue = require 'kue'

{Dungeon} = require './dungeon'
{ItemCreator} = require './item'
{Brave, BraveCreator} = require './brave'
{SearchEvent} = require './event'
{step} = require '../util'

class Simulator extends EventEmitter
    constructor : ->
        @dungeons = []
        @braves = []
        @jobs = kue.createQueue()
    
    start: (@config) ->
        mongoose.connect 'mongodb://localhost/trifolium'
        
        ItemCreator.setItemDict @config.itemDict
        BraveCreator.setBraveNameDict @config.braveNameDict
        
        step [
            (done) =>
                Dungeon.find {}, (err, dungeons) =>
                    @dungeons = dungeons
                    done()
            (done) =>
                Brave.find {}, (err, braves) =>
                    if braves.length > 0
                        @braves = braves
                        done()
                    else
                        braveInfoList = ({speed: Math.floor(Math.random() * 50) + 20} for i in [0...@config.numBraves])
                        
                        BraveCreator.createBraves braveInfoList, (braves) =>
                            @braves = braves
                            done()
        ], => @settingJobs() if @jobs
    
    settingJobs: ->
        @jobs.process 'event', @config.numBraves, (job, done) =>
            brave = @braveForId job.data.braveId
            dungeon = @dungeonForId job.data.dungeonId
            
            eventInfo = dungeon.floors[job.data.floorIndex].randomEventInfo()
            event = new SearchEvent eventInfo.treasures
            result = event.process brave
            
            @emit 'completeEvent', brave, event, result
            
            done()
        @jobs.on 'job complete', (id) ->
            kue.Job.get id, (err, job) ->
                return if err
                job.remove (err) -> throw err if err
        @jobs.promote 100
        
        for brave in @braves
            time = 3000
            @jobs.create('event',
                title: "event - #{brave.name}"
                braveId: brave.hash
                dungeonId: @dungeons[0].hash
                floorIndex: 0
            ).delay(time).save()
    
    dungeonForId: (id) ->
        (dungeon for dungeon in @dungeons when dungeon.hash == id)[0]
    
    braveForId: (id) ->
        (brave for brave in @braves when brave.hash == id)[0]
    
exports.Simulator = Simulator