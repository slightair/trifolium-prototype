var Event, EventProcess, SearchEvent,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Event = (function() {

  function Event(brave, time) {
    this.brave = brave;
    this.time = time != null ? time : 0;
    this.type = 'unknown';
  }

  Event.prototype.process = function() {};

  return Event;

})();

SearchEvent = (function(_super) {

  __extends(SearchEvent, _super);

  SearchEvent.prototype.probabilityMax = 1000;

  function SearchEvent(brave, time, treasureDict) {
    this.treasureDict = treasureDict != null ? treasureDict : {};
    SearchEvent.__super__.constructor.call(this, brave, time);
    this.type = 'search';
  }

  SearchEvent.prototype.process = function() {
    var i, id, needle, probabilities, probability, total, treasure, treasureIds, treasureInfo, _len, _ref;
    total = 0;
    _ref = this.treasureDict;
    for (id in _ref) {
      treasureInfo = _ref[id];
      total += treasureInfo.probability;
    }
    if (total > this.probabilityMax) {
      return {
        isSucceed: false,
        treasure: null
      };
    }
    treasureIds = ((function() {
      var _ref2, _results;
      _ref2 = this.treasureDict;
      _results = [];
      for (id in _ref2) {
        treasureInfo = _ref2[id];
        _results.push(id);
      }
      return _results;
    }).call(this)).sort(function(a, b) {
      return 0.5 - Math.random();
    });
    probability = 0;
    probabilities = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = treasureIds.length; _i < _len; _i++) {
        id = treasureIds[_i];
        _results.push(probability += this.treasureDict[id].probability);
      }
      return _results;
    }).call(this);
    needle = Math.random() * this.probabilityMax;
    for (i = 0, _len = treasureIds.length; i < _len; i++) {
      id = treasureIds[i];
      if (!(typeof treasure !== "undefined" && treasure !== null) && needle < probabilities[i]) {
        treasure = this.treasureDict[id].item;
      }
    }
    if (treasure && this.brave.addItem(treasure)) {
      return {
        isSucceed: true,
        treasure: treasure
      };
    } else {
      return {
        isSucceed: false,
        treasure: treasure
      };
    }
  };

  SearchEvent.prototype.save = function(result) {};

  return SearchEvent;

})(Event);

EventProcess = function(job, done) {
  var event, result;
  event = job.data;
  result = event.process();
  event.save(result);
  return done();
};

exports.SearchEvent = SearchEvent;

exports.EventProcess = EventProcess;
