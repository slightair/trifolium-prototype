var Item, ItemCreator, itemDict, should, _ref;

should = require('should');

_ref = require('../lib/trifolium/item'), Item = _ref.Item, ItemCreator = _ref.ItemCreator;

itemDict = {
  1: {
    name: 'きのこ'
  },
  2: {
    name: 'ちくわ'
  },
  3: {
    name: 'いいちくわ'
  },
  4: {
    name: 'おにく'
  },
  5: {
    name: 'いいおにく'
  },
  10: {
    name: '竹の槍'
  }
};

describe('ItemCreator', function() {
  var itemCreator;
  itemCreator = new ItemCreator(itemDict);
  it('should have itemDict', function() {
    return itemCreator.should.be.an["instanceof"](Object);
  });
  return describe('#createItem()', function() {
    return it('should create item', function() {
      var kinoko, strangeKinoko, unknownItem;
      kinoko = itemCreator.createItem(1);
      kinoko.itemId.should.equal(1);
      kinoko.name.should.equal('きのこ');
      strangeKinoko = itemCreator.createItem(1, 'へんなきのこ');
      strangeKinoko.itemId.should.equal(1);
      strangeKinoko.name.should.equal('へんなきのこ');
      unknownItem = itemCreator.createItem(-1);
      return should.not.exist.unknownItem;
    });
  });
});

describe('Item', function() {
  var kinoko, oniku, unknown;
  kinoko = new Item(1, 'きのこ');
  oniku = new Item(4, 'おにく');
  unknown = new Item(9999, 'unknown');
  it('should have itemId', function() {
    kinoko.itemId.should.equal(1);
    oniku.itemId.should.equal(4);
    return unknown.itemId.should.equal(9999);
  });
  it('should have name', function() {
    kinoko.name.should.equal("きのこ");
    oniku.name.should.equal("おにく");
    return unknown.name.should.equal("unknown");
  });
  return it('should have id', function() {
    should.exist(kinoko.id);
    should.exist(oniku.id);
    return should.exist(unknown.id);
  });
});
