var EventInfo, EventInfoSchema, EventLog, EventLogSchema, ItemCreator, ObjectId, Schema, SearchEvent, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

ObjectId = Schema.ObjectId;

EventInfoSchema = new Schema({
  id: ObjectId,
  type: String,
  treasures: [
    {
      itemId: Number,
      probability: Number
    }
  ]
});

exports.EventInfoSchema = EventInfoSchema;

EventInfo = mongoose.model('Event', EventInfoSchema);

exports.EventInfo = EventInfo;

EventLogSchema = new Schema({
  id: ObjectId,
  type: String,
  brave: String,
  isSucceed: Boolean,
  others: Schema.Types.Mixed
});

exports.EventLogSchema = EventLogSchema;

EventLog = mongoose.model('EventLog', EventLogSchema);

exports.EventLog = EventLog;

ItemCreator = require('./item').ItemCreator;

SearchEvent = (function() {

  SearchEvent.prototype.probabilityMax = 1000;

  function SearchEvent(treasures) {
    this.treasures = treasures != null ? treasures : [];
    this.type = 'search';
  }

  SearchEvent.prototype.process = function(brave) {
    var i, info, needle, probabilities, probability, result, total, treasure, treasureInfo, treasures, _i, _len, _len2, _ref;
    total = 0;
    _ref = this.treasures;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      info = _ref[_i];
      total += info.probability;
    }
    if (total > this.probabilityMax) {
      result = {
        isSucceed: false,
        treasure: null
      };
      this.save(brave, result);
      return result;
    }
    treasures = this.treasures.sort(function(a, b) {
      return 0.5 - Math.random();
    });
    probability = 0;
    probabilities = (function() {
      var _j, _len2, _results;
      _results = [];
      for (_j = 0, _len2 = treasures.length; _j < _len2; _j++) {
        info = treasures[_j];
        _results.push(probability += info.probability);
      }
      return _results;
    })();
    needle = Math.random() * this.probabilityMax;
    for (i = 0, _len2 = treasures.length; i < _len2; i++) {
      info = treasures[i];
      if (!(typeof treasureInfo !== "undefined" && treasureInfo !== null) && needle < probabilities[i]) {
        treasureInfo = info;
      }
    }
    if (treasureInfo) {
      treasure = ItemCreator.create(treasureInfo.itemId, treasureInfo.name);
    }
    if (treasure && brave.addItem(treasure)) {
      result = {
        isSucceed: true,
        treasure: treasure
      };
    } else {
      result = {
        isSucceed: false,
        treasure: treasure
      };
    }
    this.save(brave, result);
    return result;
  };

  SearchEvent.prototype.save = function(brave, result) {
    var eventLog;
    eventLog = new EventLog;
    eventLog.type = this.type;
    eventLog.brave = brave.name;
    eventLog.isSucceed = result.isSucceed;
    eventLog.others = {
      treasure: result.treasure
    };
    return eventLog.save(function(err) {
      if (err) return console.log(err.message);
    });
  };

  return SearchEvent;

})();

exports.SearchEvent = SearchEvent;
