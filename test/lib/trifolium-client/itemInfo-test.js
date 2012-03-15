var ItemInfo, clientLibPath, should;

should = require('should');

clientLibPath = '../../../lib/trifolium-client';

ItemInfo = require("" + clientLibPath + "/itemInfo").ItemInfo;

describe('ItemInfo', function() {
  var itemInfo;
  itemInfo = new ItemInfo({
    id: '28733e5e7c135e41a8c734f15283b6a186335846',
    name: 'いいきのこ',
    itemId: 2
  });
  it('should have id', function() {
    should.exist(itemInfo.id);
    return itemInfo.id.should.equal('28733e5e7c135e41a8c734f15283b6a186335846');
  });
  it('should have name', function() {
    should.exist(itemInfo.name);
    return itemInfo.name.should.equal('いいきのこ');
  });
  return it('should have itemId', function() {
    should.exist(itemInfo.itemId);
    return itemInfo.itemId.should.equal(2);
  });
});
