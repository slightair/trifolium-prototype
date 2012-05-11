mongoose = require 'mongoose'

Schema = mongoose.Schema

{EventInfoSchema} = require './event'

FloorSchema = new Schema
    number: Number
    eventInfos: [EventInfoSchema]

FloorSchema.methods.randomEventInfo = ->
    return null if @eventInfos.length == 0
    
    eventInfos = @eventInfos.sort (a, b) -> 0.5 - Math.random()
    index = parseInt(Math.random() * eventInfos.length)
    eventInfos[index]

exports.FloorSchema = FloorSchema

Floor = mongoose.model 'Floor', FloorSchema
exports.Floor = Floor