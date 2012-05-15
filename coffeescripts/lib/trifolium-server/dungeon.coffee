crypto = require 'crypto'
mongoose = require 'mongoose'

Schema = mongoose.Schema

{step} = require '../util'
{EventInfo} = require './event'
{Floor, FloorSchema} = require './floor'

DungeonSchema = new Schema
    name: String
    floors: [FloorSchema]
    hash: String

exports.DungeonSchema = DungeonSchema

Dungeon = mongoose.model 'Dungeon', DungeonSchema
exports.Dungeon = Dungeon

class DungeonCreator
    create: (info, next) ->
        @createDungeons [info], next
    
    createDungeons: (infoList, next) ->
        saveDungeonFunctions = []
        dungeons = []
        
        saveDungeon = (info) ->
            dungeon = new Dungeon
            
            dungeon.hash = crypto.createHash('sha1').update(dungeon.id).update('cf3e3815').digest('hex').substr(0, 12);
            dungeon.name = info.name ? 'unknown'
            dungeon.floors = (for floorInfo in info.floors
                floor = new Floor
                floor.number = floorInfo.number ? 0
                floor.eventInfos = (for event in floorInfo.events
                    eventInfo = new EventInfo
                    eventInfo.type = event.type ? 'unknown'
                    eventInfo.treasures = event.treasures
                    eventInfo
                )
                floor
            )
            
            saveDungeonFunctions.push (done) ->
                dungeon.save (err) ->
                    console.log err.message if err
                    dungeons.push dungeon
                    done()
        
        saveDungeon info for info in infoList
        step saveDungeonFunctions, -> next(dungeons)

exports.DungeonCreator = new DungeonCreator