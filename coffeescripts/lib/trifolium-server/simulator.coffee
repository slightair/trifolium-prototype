{EventEmitter} = require 'events'
mongoose = require 'mongoose'
kue = require 'kue'

{Dungeon} = require './dungeon'
{ItemCreator} = require './item'
{BraveCreator} = require './brave'
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
                @braves = (BraveCreator.create {speed: Math.floor(Math.random() * 50) + 20} for i in [0...@config.numBraves])
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
                braveId: brave.id
                dungeonId: @dungeons[0].id
                floorIndex: 0
            ).delay(time).save()
    
    dungeonForId: (id) ->
        (dungeon for dungeon in @dungeons when dungeon.id == id)[0]
    
    braveForId: (id) ->
        (brave for brave in @braves when brave.id == id)[0]
    
exports.Simulator = Simulator