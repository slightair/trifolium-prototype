var Item, ItemCreator;

Item = (function() {

  function Item(itemId, name) {
    var date;
    this.itemId = itemId;
    this.name = name;
    date = new Date;
    this.id = "" + (date.getTime()) + (date.getMilliseconds());
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

if (typeof exports !== "undefined" && exports !== null) exports.Item = Item;

if (typeof exports !== "undefined" && exports !== null) {
  exports.ItemCreator = ItemCreator;
}
