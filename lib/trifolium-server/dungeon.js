var Dungeon, Floor, SearchEvent;

SearchEvent = require('./event').SearchEvent;

Floor = (function() {

  function Floor(floorInfo) {
    this.id = floorInfo._id;
    this.number = floorInfo.number;
    this.events = floorInfo.events;
  }

  Floor.prototype.pickEventInfo = function() {
    var events, index;
    if (this.events.length === 0) return null;
    events = this.events.sort(function(a, b) {
      return 0.5 - Math.random();
    });
    index = parseInt(Math.random() * events.length);
    return events[index];
  };

  return Floor;

})();

Dungeon = (function() {

  function Dungeon(dungeonInfo) {
    var info, _ref;
    this.name = (_ref = dungeonInfo.name) != null ? _ref : 'unknown';
    this.id = dungeonInfo._id;
    this.floors = (function() {
      var _i, _len, _ref2, _results;
      _ref2 = dungeonInfo.floors;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        info = _ref2[_i];
        _results.push(new Floor(info));
      }
      return _results;
    })();
  }

  return Dungeon;

})();

exports.Floor = Floor;

exports.Dungeon = Dungeon;
