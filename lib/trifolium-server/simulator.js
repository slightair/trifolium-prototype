var Brave, BraveCreator, Dungeon, EventEmitter, ItemCreator, SearchEvent, Simulator, kue, mongoose, step, _ref,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

EventEmitter = require('events').EventEmitter;

mongoose = require('mongoose');

kue = require('kue');

Dungeon = require('./dungeon').Dungeon;

ItemCreator = require('./item').ItemCreator;

_ref = require('./brave'), Brave = _ref.Brave, BraveCreator = _ref.BraveCreator;

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
    var _this = this;
    this.config = config;
    mongoose.connect('mongodb://localhost/trifolium');
    ItemCreator.setItemDict(this.config.itemDict);
    BraveCreator.setBraveNameDict(this.config.braveNameDict);
    return step([
      function(done) {
        return Dungeon.find({}, function(err, dungeons) {
          _this.dungeons = dungeons;
          return done();
        });
      }, function(done) {
        return Brave.find({}, function(err, braves) {
          var braveInfoList, i;
          if (braves.length > 0) {
            _this.braves = braves;
            return done();
          } else {
            braveInfoList = (function() {
              var _ref2, _results;
              _results = [];
              for (i = 0, _ref2 = this.config.numBraves; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
                _results.push({
                  speed: Math.floor(Math.random() * 50) + 20
                });
              }
              return _results;
            }).call(_this);
            return BraveCreator.createBraves(braveInfoList, function(braves) {
              _this.braves = braves;
              return done();
            });
          }
        });
      }
    ], function() {
      if (_this.jobs) return _this.settingJobs();
    });
  };

  Simulator.prototype.settingJobs = function() {
    var brave, time, _i, _len, _ref2, _results,
      _this = this;
    this.jobs.process('event', this.config.numBraves, function(job, done) {
      var brave, dungeon, event, eventInfo, result;
      brave = _this.braveForId(job.data.braveId);
      dungeon = _this.dungeonForId(job.data.dungeonId);
      eventInfo = dungeon.floors[job.data.floorIndex].randomEventInfo();
      event = new SearchEvent(eventInfo.treasures);
      result = event.process(brave);
      _this.emit('completeEvent', brave, event, result);
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
    _ref2 = this.braves;
    _results = [];
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      brave = _ref2[_i];
      time = 3000;
      _results.push(this.jobs.create('event', {
        title: "event - " + brave.name,
        braveId: brave.hash,
        dungeonId: this.dungeons[0].hash,
        floorIndex: 0
      }).delay(time).save());
    }
    return _results;
  };

  Simulator.prototype.dungeonForId = function(id) {
    var dungeon;
    return ((function() {
      var _i, _len, _ref2, _results;
      _ref2 = this.dungeons;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        dungeon = _ref2[_i];
        if (dungeon.hash === id) _results.push(dungeon);
      }
      return _results;
    }).call(this))[0];
  };

  Simulator.prototype.braveForId = function(id) {
    var brave;
    return ((function() {
      var _i, _len, _ref2, _results;
      _ref2 = this.braves;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        brave = _ref2[_i];
        if (brave.hash === id) _results.push(brave);
      }
      return _results;
    }).call(this))[0];
  };

  return Simulator;

})(EventEmitter);

exports.Simulator = Simulator;
