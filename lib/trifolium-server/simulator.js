var BraveCreator, EventEmitter, ItemCreator, Simulator, eventProcess, kue,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

EventEmitter = require('events').EventEmitter;

kue = require('kue');

BraveCreator = require('./brave').BraveCreator;

ItemCreator = require('./item').ItemCreator;

eventProcess = require('./event').eventProcess;

Simulator = (function(_super) {

  __extends(Simulator, _super);

  function Simulator() {
    this.dungeonList = [];
    this.braveList = [];
  }

  Simulator.prototype.start = function(config) {
    var braveNameDict, dungeonInfo, dungeonList, i, itemDict, numBraves;
    dungeonList = config.dungeonList, braveNameDict = config.braveNameDict, numBraves = config.numBraves, itemDict = config.itemDict;
    braveCreator.setBraveNameDict(braveNameDict);
    ItemCreator.setItemDict(itemDict);
    this.dungeonList = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = dungeonInfoList.length; _i < _len; _i++) {
        dungeonInfo = dungeonInfoList[_i];
        _results.push(new Dungeon(dungeonInfo));
      }
      return _results;
    })();
    this.braveList = (function() {
      var _results;
      _results = [];
      for (i = 0; 0 <= numBraves ? i < numBraves : i > numBraves; 0 <= numBraves ? i++ : i--) {
        _results.push(new Brave(this.makeBraveName(braveNameDictionary), spawnSpot, {
          speed: Math.floor(Math.random() * 50) + 20
        }));
      }
      return _results;
    }).call(this);
    this.jobs = kue.createQueue();
    return this.jobs.process('event', eventProcess);
  };

  Simulator.prototype.dungeonForName = function(name) {
    var dungeon;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = this.dungeonList;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dungeon = _ref[_i];
        if (dungeon.name === name) _results.push(dungeon);
      }
      return _results;
    }).call(this))[0];
  };

  Simulator.prototype.braveForName = function(name) {
    var brave;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = this.braveList;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        brave = _ref[_i];
        if (brave.name === name) _results.push(brave);
      }
      return _results;
    }).call(this))[0];
  };

  return Simulator;

})(EventEmitter);

exports.Simulator = Simulator;
