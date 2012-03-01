var Item, ItemCreator, SharedItemCreator, itemDict;

if (typeof require !== "undefined" && require !== null) {
  itemDict = require('../../settings').itemDict;
}

Item = (function() {

  function Item(itemId, name) {
    var date;
    this.itemId = itemId;
    this.name = name;
    date = new Date;
    this.id = "" + (date.getTime()) + (date.getMilliseconds()) + this.itemId + this.name;
  }

  return Item;

})();

ItemCreator = (function() {

  function ItemCreator(itemDict) {
    this.itemDict = itemDict;
  }

  ItemCreator.prototype.createItem = function(itemId, name) {
    if (name == null) name = null;
    if (this.itemDict[itemId] != null) {
      return new Item(itemId, name != null ? name : this.itemDict[itemId].name);
    } else {
      return null;
    }
  };

  return ItemCreator;

})();

SharedItemCreator = new ItemCreator(itemDict);

if (typeof exports !== "undefined" && exports !== null) exports.Item = Item;

if (typeof exports !== "undefined" && exports !== null) {
  exports.ItemCreator = ItemCreator;
}

if (typeof exports !== "undefined" && exports !== null) {
  exports.SharedItemCreator = SharedItemCreator;
}
