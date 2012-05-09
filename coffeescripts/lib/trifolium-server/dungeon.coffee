mongoose = require 'mongoose'

Schema = mongoose.Schema
ObjectId = Schema.ObjectId

{FloorSchema} = require './floor'

DungeonSchema = new Schema
    id: ObjectId
    name: String
    floors: [FloorSchema]

exports.DungeonSchema = DungeonSchema

Dungeon = mongoose.model 'Dungeon', DungeonSchema
exports.Dungeon = Dungeon