mongoose = require 'mongoose'
mongoose.connect 'mongodb://localhost/trifolium'

Schema = mongoose.Schema
ObjectId = Schema.ObjectId

EventSchema = new Schema
    id: ObjectId
    type: String
    treasures: [{
        itemId: Number
        probability: Number
    }]
EventModel = mongoose.model 'Event', EventSchema

FloorSchema = new Schema
    id: ObjectId
    number: Number
    events: [EventSchema]
FloorModel = mongoose.model 'Floor', FloorSchema

DungeonSchema = new Schema
    id: ObjectId
    name: String
    floors: [FloorSchema]
DungeonModel = mongoose.model 'Dungeon', DungeonSchema

exports.EventModel = EventModel
exports.FloorModel = FloorModel
exports.DungeonModel = DungeonModel
