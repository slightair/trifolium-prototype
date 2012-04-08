var Event, ItemCreator, SearchEvent, SearchEventProcess,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

ItemCreator = require('./item').ItemCreator;

Event = (function() {

  function Event(brave, time) {
    this.brave = brave;
    this.time = time != null ? time : 0;
    this.type = 'unknown';
  }

  return Event;

})();

SearchEvent = (function(_super) {

  __extends(SearchEvent, _super);

  function SearchEvent(brave, time, treasureList) {
    this.treasureList = treasureList != null ? treasureList : [];
    SearchEvent.__super__.constructor.call(this, brave, time);
    this.type = 'search';
  }

  return SearchEvent;

})(Event);

SearchEventProcess = function(job, done) {
  var event, i, info, needle, probabilities, probability, probabilityMax, result, total, treasure, treasureInfo, treasureList, _i, _len, _len2, _ref;
  probabilityMax = 1000;
  event = job.data;
  total = 0;
  _ref = event.treasureList;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    info = _ref[_i];
    total += info.probability;
  }
  if (total > probabilityMax) {
    result = {
      isSucceed: false,
      treasure: null
    };
    done();
    return result;
  }
  treasureList = event.treasureList.sort(function(a, b) {
    return 0.5 - Math.random();
  });
  probability = 0;
  probabilities = (function() {
    var _j, _len2, _results;
    _results = [];
    for (_j = 0, _len2 = treasureList.length; _j < _len2; _j++) {
      info = treasureList[_j];
      _results.push(probability += info.probability);
    }
    return _results;
  })();
  needle = Math.random() * probabilityMax;
  for (i = 0, _len2 = treasureList.length; i < _len2; i++) {
    info = treasureList[i];
    if (!(typeof treasureInfo !== "undefined" && treasureInfo !== null) && needle < probabilities[i]) {
      treasureInfo = info;
    }
  }
  if (treasureInfo) {
    treasure = ItemCreator.create(treasureInfo.itemId, treasureInfo.name);
  }
  if (treasure && event.brave.addItem(treasure)) {
    result = {
      isSucceed: true,
      treasure: treasure
    };
    done();
    return result;
  } else {
    result = {
      isSucceed: false,
      treasure: treasure
    };
    done();
    return result;
  }
};

exports.SearchEvent = SearchEvent;

exports.SearchEventProcess = SearchEventProcess;
