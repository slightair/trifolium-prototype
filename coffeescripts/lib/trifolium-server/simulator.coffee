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
    
    start: (@config) ->
        ItemCreator.setItemDict @config.itemDict
        BraveCreator.setBraveNameDict @config.braveNameDict
        
        step [
            (done) => @makeDungeons done
            (done) => @makeBraves done
        ], => @settingJobs() if @jobs
    
    settingJobs: ->
        @jobs.process 'event', @config.numBraves, (job, done) =>
            brave = @braveForId job.data.braveId
            dungeon = @dungeonForId job.data.dungeonId
            eventInfo = dungeon.floors[job.data.floorIndex].pickEventInfo()
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
    
    makeDungeons: (done) ->
        DungeonModel.find {}, (err, dungeons) =>
            @dungeons = (new Dungeon dungeonInfo for dungeonInfo in dungeons)
            done()
    
    makeBraves: (done) ->
        @braves = (BraveCreator.create {speed: Math.floor(Math.random() * 50) + 20} for i in [0...@config.numBraves])
        done()
    
    dungeonForId: (id) ->
        (dungeon for dungeon in @dungeons when dungeon.id == id)[0]
    
    braveForId: (id) ->
        (brave for brave in @braves when brave.id == id)[0]
    
exports.Simulator = Simulator