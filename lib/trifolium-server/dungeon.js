var Dungeon, DungeonSchema, FloorSchema, ObjectId, Schema, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

ObjectId = Schema.ObjectId;

FloorSchema = require('./floor').FloorSchema;

DungeonSchema = new Schema({
  id: ObjectId,
  name: String,
  floors: [FloorSchema]
});

exports.DungeonSchema = DungeonSchema;

Dungeon = mongoose.model('Dungeon', DungeonSchema);

exports.Dungeon = Dungeon;
