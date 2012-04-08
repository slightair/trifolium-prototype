var BraveCreator, Dungeon, EventEmitter, ItemCreator, SearchEvent, SearchEventProcess, Simulator, kue, _ref,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

EventEmitter = require('events').EventEmitter;

kue = require('kue');

ItemCreator = require('./item').ItemCreator;

BraveCreator = require('./brave').BraveCreator;

Dungeon = require("./dungeon").Dungeon;

_ref = require('./event'), SearchEvent = _ref.SearchEvent, SearchEventProcess = _ref.SearchEventProcess;

Simulator = (function(_super) {

  __extends(Simulator, _super);

  function Simulator() {
    this.dungeonList = [];
    this.braveList = [];
    this.jobs = null;
  }

  Simulator.prototype.start = function(config) {
    var braveNameDict, dungeonInfo, dungeonList, i, itemDict, numBraves;
    dungeonList = config.dungeonList, braveNameDict = config.braveNameDict, numBraves = config.numBraves, itemDict = config.itemDict;
    ItemCreator.setItemDict(itemDict);
    BraveCreator.setBraveNameDict(braveNameDict);
    this.dungeonList = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = dungeonList.length; _i < _len; _i++) {
        dungeonInfo = dungeonList[_i];
        _results.push(new Dungeon(dungeonInfo));
      }
      return _results;
    })();
    this.braveList = (function() {
      var _results;
      _results = [];
      for (i = 0; 0 <= numBraves ? i < numBraves : i > numBraves; 0 <= numBraves ? i++ : i--) {
        _results.push(BraveCreator.create({
          speed: Math.floor(Math.random() * 50) + 20
        }));
      }
      return _results;
    })();
    this.jobs = kue.createQueue();
    this.jobs.process('searchEvent', numBraves, SearchEventProcess);
    return this.jobs.on('job complete', function(id) {
      return Job.get(id, function(err, job) {
        if (err) return;
        return job.remove(function(err) {
          if (err) throw err;
        });
      });
    });
  };

  Simulator.prototype.dungeonForName = function(name) {
    var dungeon;
    return ((function() {
      var _i, _len, _ref2, _results;
      _ref2 = this.dungeonList;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        dungeon = _ref2[_i];
        if (dungeon.name === name) _results.push(dungeon);
      }
      return _results;
    }).call(this))[0];
  };

  Simulator.prototype.braveForName = function(name) {
    var brave;
    return ((function() {
      var _i, _len, _ref2, _results;
      _ref2 = this.braveList;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        brave = _ref2[_i];
        if (brave.name === name) _results.push(brave);
      }
      return _results;
    }).call(this))[0];
  };

  return Simulator;

})(EventEmitter);

exports.Simulator = Simulator;
