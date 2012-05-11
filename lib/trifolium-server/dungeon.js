var Dungeon, DungeonSchema, FloorSchema, Schema, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

FloorSchema = require('./floor').FloorSchema;

DungeonSchema = new Schema({
  name: String,
  floors: [FloorSchema],
  hash: String
});

exports.DungeonSchema = DungeonSchema;

Dungeon = mongoose.model('Dungeon', DungeonSchema);

exports.Dungeon = Dungeon;
