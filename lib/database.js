var DungeonModel, DungeonSchema, EventLogModel, EventLogSchema, EventModel, EventSchema, FloorModel, FloorSchema, ObjectId, Schema, mongoose;

mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/trifolium');

Schema = mongoose.Schema;

ObjectId = Schema.ObjectId;

EventSchema = new Schema({
  id: ObjectId,
  type: String,
  treasures: [
    {
      itemId: Number,
      probability: Number
    }
  ]
});

EventModel = mongoose.model('Event', EventSchema);

FloorSchema = new Schema({
  id: ObjectId,
  number: Number,
  events: [EventSchema]
});

FloorModel = mongoose.model('Floor', FloorSchema);

DungeonSchema = new Schema({
  id: ObjectId,
  name: String,
  floors: [FloorSchema]
});

DungeonModel = mongoose.model('Dungeon', DungeonSchema);

EventLogSchema = new Schema({
  id: ObjectId,
  type: String,
  brave: String,
  isSucceed: Boolean,
  others: Schema.Types.Mixed
});

EventLogModel = mongoose.model('EventLog', EventLogSchema);

exports.EventModel = EventModel;

exports.FloorModel = FloorModel;

exports.DungeonModel = DungeonModel;

exports.EventLogModel = EventLogModel;
