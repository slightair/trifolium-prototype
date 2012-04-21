var BraveCreator, Dungeon, DungeonModel, EventEmitter, ItemCreator, SearchEvent, Simulator, kue, step,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

EventEmitter = require('events').EventEmitter;

kue = require('kue');

DungeonModel = require('../database').DungeonModel;

ItemCreator = require('./item').ItemCreator;

BraveCreator = require('./brave').BraveCreator;

Dungeon = require("./dungeon").Dungeon;

SearchEvent = require('./event').SearchEvent;

step = require('../util').step;

Simulator = (function(_super) {

  __extends(Simulator, _super);

  function Simulator() {
    this.dungeons = [];
    this.braves = [];
    this.jobs = kue.createQueue();
  }

  Simulator.prototype.start = function(config) {
    var braveNameDict, itemDict, numBraves,
      _this = this;
    braveNameDict = config.braveNameDict, numBraves = config.numBraves, itemDict = config.itemDict;
    ItemCreator.setItemDict(itemDict);
    BraveCreator.setBraveNameDict(braveNameDict);
    return step([
      function(done) {
        return _this.makeDungeons(done);
      }, function(done) {
        return _this.makeBraves(numBraves, done);
      }
    ], function() {
      var brave, dungeon, eventInfo, job, simulator, time, _i, _len, _ref, _results;
      if (_this.jobs) {
        _this.jobs.process('searchEvent', numBraves, function(job, done) {
          return done();
        });
        _this.jobs.on('job complete', function(id) {
          return kue.Job.get(id, function(err, job) {
            if (err) return;
            return job.remove(function(err) {
              if (err) throw err;
            });
          });
        });
        _this.jobs.promote(100);
        _ref = _this.braves;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          brave = _ref[_i];
          dungeon = _this.dungeons[0];
          eventInfo = dungeon.floors[0].pickEventInfo();
          time = 10000;
          simulator = _this;
          _results.push(job = _this.jobs.create('searchEvent', {
            treasures: eventInfo.treasures,
            braveId: brave.id
          }).on('complete', function() {
            var event, result;
            brave = simulator.braveForId(this.data.braveId);
            event = new SearchEvent(this.data.treasures);
            result = event.process(brave);
            return simulator.emit('completeSearchEvent', brave, event, result);
          }).delay(time).save());
        }
        return _results;
      }
    });
  };

  Simulator.prototype.makeDungeons = function(done) {
    var _this = this;
    return DungeonModel.find({}, function(err, dungeons) {
      var dungeonInfo;
      _this.dungeons = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = dungeons.length; _i < _len; _i++) {
          dungeonInfo = dungeons[_i];
          _results.push(new Dungeon(dungeonInfo));
        }
        return _results;
      })();
      return done();
    });
  };

  Simulator.prototype.makeBraves = function(numBraves, done) {
    var i;
    this.braves = (function() {
      var _results;
      _results = [];
      for (i = 0; 0 <= numBraves ? i < numBraves : i > numBraves; 0 <= numBraves ? i++ : i--) {
        _results.push(BraveCreator.create({
          speed: Math.floor(Math.random() * 50) + 20
        }));
      }
      return _results;
    })();
    return done();
  };

  Simulator.prototype.dungeonForId = function(id) {
    var dungeon;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = this.dungeons;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dungeon = _ref[_i];
        if (dungeon.id === id) _results.push(dungeon);
      }
      return _results;
    }).call(this))[0];
  };

  Simulator.prototype.braveForId = function(id) {
    var brave;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = this.braves;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        brave = _ref[_i];
        if (brave.id === id) _results.push(brave);
      }
      return _results;
    }).call(this))[0];
  };

  return Simulator;

})(EventEmitter);

exports.Simulator = Simulator;
