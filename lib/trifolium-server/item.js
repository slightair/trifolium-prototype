var Item, ItemCreator, itemDict;

itemDict = require('../../settings').itemDict;

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

exports.Item = Item;

exports.ItemCreator = ItemCreator;

exports.SharedItemCreator = new ItemCreator(itemDict);
