var Item, should;

should = require('should');

Item = require('../lib/trifolium/item').Item;

describe('item', function() {
  var item, kinoko;
  item = new Item;
  kinoko = new Item("きのこ");
  it('should have name', function() {
    item.name.should.equal("unknown");
    return kinoko.name.should.equal("きのこ");
  });
  return it('should have id', function() {
    should.exist(item.id);
    return should.exist(kinoko.id);
  });
});
