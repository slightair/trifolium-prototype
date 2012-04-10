var Dungeon, crypto;

crypto = require('crypto');

Dungeon = (function() {

  function Dungeon(dungeonInfo) {
    var date, _ref, _ref2;
    date = new Date;
    this.name = (_ref = dungeonInfo.name) != null ? _ref : "unknown";
    this.id = crypto.createHash('sha1').update("" + this.name).update('bf75e9d57c76d607').update("" + (date.getTime())).update("" + (date.getMilliseconds())).digest('hex');
    this.floorList = (_ref2 = dungeonInfo.floorList) != null ? _ref2 : [];
  }

  Dungeon.prototype.pickEvent = function(f) {
    var floor, index;
    if (!(this.floorList.length > f)) return null;
    floor = this.floorList[f].sort(function(a, b) {
      return 0.5 - Math.random();
    });
    index = parseInt(Math.random() * floor.length);
    return floor[index];
  };

  return Dungeon;

})();

exports.Dungeon = Dungeon;
