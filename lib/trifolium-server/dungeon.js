var Dungeon, DungeonCreator, DungeonSchema, EventInfo, Floor, FloorSchema, Schema, crypto, mongoose, step, _ref;

crypto = require('crypto');

mongoose = require('mongoose');

Schema = mongoose.Schema;

step = require('../util').step;

EventInfo = require('./event').EventInfo;

_ref = require('./floor'), Floor = _ref.Floor, FloorSchema = _ref.FloorSchema;

DungeonSchema = new Schema({
  name: String,
  floors: [FloorSchema],
  hash: String
});

exports.DungeonSchema = DungeonSchema;

Dungeon = mongoose.model('Dungeon', DungeonSchema);

exports.Dungeon = Dungeon;

DungeonCreator = (function() {

  function DungeonCreator() {}

  DungeonCreator.prototype.create = function(info, next) {
    return this.createDungeons([info], next);
  };

  DungeonCreator.prototype.createDungeons = function(infoList, next) {
    var dungeons, info, saveDungeon, saveDungeonFunctions, _i, _len;
    saveDungeonFunctions = [];
    dungeons = [];
    saveDungeon = function(info) {
      var dungeon, event, eventInfo, floor, floorInfo, _ref2;
      dungeon = new Dungeon;
      dungeon.hash = crypto.createHash('sha1').update(dungeon.id).update('cf3e3815').digest('hex').substr(0, 12);
      dungeon.name = (_ref2 = info.name) != null ? _ref2 : 'unknown';
      dungeon.floors = (function() {
        var _i, _len, _ref3, _ref4, _results;
        _ref3 = info.floors;
        _results = [];
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          floorInfo = _ref3[_i];
          floor = new Floor;
          floor.number = (_ref4 = floorInfo.number) != null ? _ref4 : 0;
          floor.eventInfos = (function() {
            var _j, _len2, _ref5, _ref6, _results2;
            _ref5 = floorInfo.events;
            _results2 = [];
            for (_j = 0, _len2 = _ref5.length; _j < _len2; _j++) {
              event = _ref5[_j];
              eventInfo = new EventInfo;
              eventInfo.type = (_ref6 = event.type) != null ? _ref6 : 'unknown';
              eventInfo.treasures = event.treasures;
              _results2.push(eventInfo);
            }
            return _results2;
          })();
          _results.push(floor);
        }
        return _results;
      })();
      return saveDungeonFunctions.push(function(done) {
        return dungeon.save(function(err) {
          if (err) console.log(err.message);
          dungeons.push(dungeon);
          return done();
        });
      });
    };
    for (_i = 0, _len = infoList.length; _i < _len; _i++) {
      info = infoList[_i];
      saveDungeon(info);
    }
    return step(saveDungeonFunctions, function() {
      return next(dungeons);
    });
  };

  return DungeonCreator;

})();

exports.DungeonCreator = new DungeonCreator;
