mongoose = require 'mongoose'

Schema = mongoose.Schema
ObjectId = Schema.ObjectId

{FloorSchema} = require './floor'

DungeonSchema = new Schema
    name: String
    floors: [FloorSchema]
    hash: String

exports.DungeonSchema = DungeonSchema

Dungeon = mongoose.model 'Dungeon', DungeonSchema
exports.Dungeon = Dungeon