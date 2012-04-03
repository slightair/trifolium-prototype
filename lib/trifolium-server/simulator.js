var Brave, EventEmitter, SharedItemCreator, Simulator, eventProcess, kue,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

EventEmitter = require('events').EventEmitter;

kue = require('kue');

Brave = require('./brave').Brave;

SharedItemCreator = require('./item').SharedItemCreator;

eventProcess = require('./event').eventProcess;

Simulator = (function(_super) {

  __extends(Simulator, _super);

  function Simulator() {
    this.dungeonList = [];
    this.braveList = [];
  }

  Simulator.prototype.start = function(config) {
    var braveNameDictionary, dict, dungeonInfo, dungeonList, i, itemDict, numBraves, term, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref, _ref2, _ref3, _ref4;
    dungeonList = config.dungeonList, braveNameDictionary = config.braveNameDictionary, numBraves = config.numBraves, itemDict = config.itemDict;
    SharedItemCreator.itemDict = itemDict;
    this.dungeonList = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = dungeonInfoList.length; _i < _len; _i++) {
        dungeonInfo = dungeonInfoList[_i];
        _results.push(new Dungeon(dungeonInfo));
      }
      return _results;
    })();
    _ref = [braveNameDictionary.prefixes, braveNameDictionary.terms];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dict = _ref[_i];
      for (_j = 0, _len2 = dict.length; _j < _len2; _j++) {
        term = dict[_j];
        ((_ref2 = this.braveNamePrefixes) != null ? _ref2 : this.braveNamePrefixes = []).push(term);
      }
    }
    _ref3 = [braveNameDictionary.suffixes, braveNameDictionary.terms];
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      dict = _ref3[_k];
      for (_l = 0, _len4 = dict.length; _l < _len4; _l++) {
        term = dict[_l];
        ((_ref4 = this.braveNameSuffixes) != null ? _ref4 : this.braveNameSuffixes = []).push(term);
      }
    }
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

  Simulator.prototype.makeBraveName = function() {
    var prefixIndex, suffixIndex;
    prefixIndex = parseInt(Math.random() * this.braveNamePrefixes.length);
    suffixIndex = parseInt(Math.random() * this.braveNameSuffixes.length);
    return "" + this.braveNamePrefixes[prefixIndex] + this.braveNameSuffixes[suffixIndex];
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
