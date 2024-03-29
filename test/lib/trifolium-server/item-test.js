var Item, ItemCreator, itemDict, library, serverLibPath, should, _ref;

should = require('should');

library = process.env['TRIFOLIUM_COV'] ? 'lib-cov' : 'lib';

serverLibPath = "../../../" + library + "/trifolium-server";

_ref = require("" + serverLibPath + "/item"), Item = _ref.Item, ItemCreator = _ref.ItemCreator;

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
  ItemCreator.setItemDict(itemDict);
  it('should have itemDict', function() {
    return ItemCreator.itemDict.should.be.an["instanceof"](Object);
  });
  return describe('#create()', function() {
    return it('should create item', function() {
      var kinoko, strangeKinoko, unknownItem;
      kinoko = ItemCreator.create(1);
      kinoko.itemId.should.equal(1);
      kinoko.name.should.equal('きのこ');
      strangeKinoko = ItemCreator.create(1, 'へんなきのこ');
      strangeKinoko.itemId.should.equal(1);
      strangeKinoko.name.should.equal('へんなきのこ');
      unknownItem = ItemCreator.create(-1);
      return should.not.exist(unknownItem);
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
  it('should have id', function() {
    should.exist(kinoko.id);
    should.exist(oniku.id);
    return should.exist(unknown.id);
  });
  return describe('#details()', function() {
    return it('should return item details', function() {
      var details;
      details = kinoko.details();
      should.exist(details);
      details.should.be.an["instanceof"](Object);
      should.exist(details.id, 'id should exist');
      details.id.should.equal(kinoko.id);
      should.exist(details.itemId, 'itemId should exist');
      details.itemId.should.equal(1);
      should.exist(details.name, 'name should exist');
      return details.name.should.equal('きのこ');
    });
  });
});
