var Dungeon;

Dungeon = (function() {

  function Dungeon(dungeonInfo) {
    var eventInfo, _ref;
    this.name = (_ref = dungeonInfo.name) != null ? _ref : "unknown";
    this.eventList = (function() {
      var _i, _len, _ref2, _ref3, _results;
      _ref3 = (_ref2 = dungeonInfo.eventList) != null ? _ref2 : [];
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        eventInfo = _ref3[_i];
        _results.push(new Event(eventInfo));
      }
      return _results;
    })();
  }

  return Dungeon;

})();

exports.Dungeon = Dungeon;
