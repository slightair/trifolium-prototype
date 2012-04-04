var Dungeon;

Dungeon = (function() {

  function Dungeon(dungeonInfo) {
    var _ref, _ref2;
    this.name = (_ref = dungeonInfo.name) != null ? _ref : "unknown";
    this.floors = (_ref2 = dungeonInfo.floors) != null ? _ref2 : [];
  }

  Dungeon.prototype.pickEvent = function(f) {
    var floor, index;
    if (!(this.floors.length > f)) return null;
    floor = this.floors[f].sort(function(a, b) {
      return 0.5 - Math.random();
    });
    index = parseInt(Math.random() * floor.length);
    return floor[index];
  };

  return Dungeon;

})();

exports.Dungeon = Dungeon;
