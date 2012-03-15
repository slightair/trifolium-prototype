var ItemInfo;

ItemInfo = (function() {

  function ItemInfo(details) {
    var _ref, _ref2, _ref3;
    this.id = (_ref = details.id) != null ? _ref : 'unknown';
    this.name = (_ref2 = details.name) != null ? _ref2 : 'unknown';
    this.itemId = (_ref3 = details.itemId) != null ? _ref3 : 0;
  }

  return ItemInfo;

})();

if (typeof exports !== "undefined" && exports !== null) {
  exports.ItemInfo = ItemInfo;
}
