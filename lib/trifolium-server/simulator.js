var BraveCreator, Dungeon, EventEmitter, ItemCreator, SearchEvent, Simulator, kue,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

EventEmitter = require('events').EventEmitter;

kue = require('kue');

ItemCreator = require('./item').ItemCreator;

BraveCreator = require('./brave').BraveCreator;

Dungeon = require("./dungeon").Dungeon;

SearchEvent = require('./event').SearchEvent;

Simulator = (function(_super) {

  __extends(Simulator, _super);

  function Simulator() {
    this.dungeons = [];
    this.braves = [];
    this.jobs = kue.createQueue();
  }

  Simulator.prototype.start = function(config) {
    var brave, braveNameDict, dungeon, dungeonInfo, dungeons, eventInfo, i, itemDict, job, numBraves, simulator, time, _i, _len, _ref, _results;
    dungeons = config.dungeons, braveNameDict = config.braveNameDict, numBraves = config.numBraves, itemDict = config.itemDict;
    ItemCreator.setItemDict(itemDict);
    BraveCreator.setBraveNameDict(braveNameDict);
    this.dungeons = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = dungeons.length; _i < _len; _i++) {
        dungeonInfo = dungeons[_i];
        _results.push(new Dungeon(dungeonInfo));
      }
      return _results;
    })();
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
    if (this.jobs) {
      this.jobs.process('searchEvent', numBraves, function(job, done) {
        return done();
      });
      this.jobs.on('job complete', function(id) {
        return kue.Job.get(id, function(err, job) {
          if (err) return;
          return job.remove(function(err) {
            if (err) throw err;
          });
        });
      });
      this.jobs.promote(100);
      _ref = this.braves;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        brave = _ref[_i];
        dungeon = this.dungeons[0];
        eventInfo = dungeon.pickEventInfo(0);
        time = 10000;
        simulator = this;
        _results.push(job = this.jobs.create('searchEvent', {
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
