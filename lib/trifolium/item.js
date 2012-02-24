var Item;

Item = (function() {

  function Item(name) {
    var date;
    this.name = name != null ? name : 'unknown';
    date = new Date;
    this.id = "" + (date.getTime()) + (date.getMilliseconds());
  }

  return Item;

})();

if (typeof exports !== "undefined" && exports !== null) exports.Item = Item;
