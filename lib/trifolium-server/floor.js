var EventInfoSchema, Floor, FloorSchema, Schema, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

EventInfoSchema = require('./event').EventInfoSchema;

FloorSchema = new Schema({
  number: Number,
  eventInfos: [EventInfoSchema]
});

FloorSchema.methods.randomEventInfo = function() {
  var eventInfos, index;
  if (this.eventInfos.length === 0) return null;
  eventInfos = this.eventInfos.sort(function(a, b) {
    return 0.5 - Math.random();
  });
  index = parseInt(Math.random() * eventInfos.length);
  return eventInfos[index];
};

exports.FloorSchema = FloorSchema;

Floor = mongoose.model('Floor', FloorSchema);

exports.Floor = Floor;
