var SpotInfo;

SpotInfo = (function() {

  function SpotInfo(details) {
    var _ref, _ref2, _ref3, _ref4;
    this.id = (_ref = details.id) != null ? _ref : 'unknown';
    this.name = (_ref2 = details.name) != null ? _ref2 : 'unknown';
    this.posX = (_ref3 = details.posX) != null ? _ref3 : 0;
    this.posY = (_ref4 = details.posY) != null ? _ref4 : 0;
  }

  return SpotInfo;

})();

if (typeof exports !== "undefined" && exports !== null) {
  exports.SpotInfo = SpotInfo;
}
