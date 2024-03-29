var Item, ItemCreator, crypto;

crypto = require('crypto');

Item = (function() {

  function Item(itemId, name) {
    var date;
    this.itemId = itemId;
    this.name = name;
    date = new Date;
    this.hash = crypto.createHash('sha1').update("" + this.itemId).update("" + this.name).update('2c77a50b0c670bb6').update("" + (date.getTime())).update("" + (date.getMilliseconds())).digest('hex').substr(0, 12);
  }

  Item.prototype.details = function() {
    return {
      name: this.name,
      itemId: this.itemId,
      hash: this.hash
    };
  };

  return Item;

})();

ItemCreator = (function() {

  function ItemCreator() {
    this.itemDict = {};
  }

  ItemCreator.prototype.setItemDict = function(itemDict) {
    return this.itemDict = itemDict;
  };

  ItemCreator.prototype.create = function(itemId, name) {
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

exports.ItemCreator = new ItemCreator;
