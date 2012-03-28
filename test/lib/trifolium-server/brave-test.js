var Brave, Item, serverLibPath, should;

should = require('should');

serverLibPath = '../../../lib/trifolium-server';

Brave = require("" + serverLibPath + "/brave").Brave;

Item = require("" + serverLibPath + "/item").Item;

describe('Brave', function() {
  var brave;
  brave = null;
  beforeEach(function() {
    return brave = new Brave('testBrave');
  });
  it('should have id', function() {
    return should.exist(brave.id);
  });
  it('should have name', function() {
    return brave.name.should.equal('testBrave');
  });
  it('should have lv', function() {
    return brave.lv.should.equal(1);
  });
  it('should have atk', function() {
    return brave.atk.should.equal(1);
  });
  it('should have matk', function() {
    return brave.matk.should.equal(1);
  });
  it('should have hp', function() {
    return brave.hp.should.equal(10);
  });
  it('should have mp', function() {
    return brave.mp.should.equal(10);
  });
  it('should have brave', function() {
    return brave.brave.should.equal(50);
  });
  it('should have faith', function() {
    return brave.faith.should.equal(50);
  });
  it('should have speed', function() {
    return brave.speed.should.equal(3);
  });
  it('should have items', function() {
    brave.items.should.be.an["instanceof"](Array);
    return brave.items.should.be.empty;
  });
  it('should have gold', function() {
    return brave.gold.should.equal(300);
  });
  describe('#addItem()', function() {
    beforeEach(function() {
      return brave.items = [];
    });
    it('should add an item', function() {
      var item, result;
      item = new Item;
      brave.items.should.be.empty;
      result = brave.addItem(item);
      brave.items.should.include(item);
      return result.should.be.ok;
    });
    return it('should not add item over 10 items', function() {
      var i, result;
      for (i = 0; i < 10; i++) {
        brave.addItem(new Item);
      }
      brave.items.should.have.length(10);
      result = brave.addItem(new Item);
      result.should.not.be.ok;
      return brave.items.should.have.length(10);
    });
  });
  describe('#removeItem()', function() {
    var item;
    item = new Item;
    beforeEach(function() {
      return brave.items = [item];
    });
    it('should remove an item', function() {
      brave.items.should.not.be.empty;
      brave.items.should.include(item);
      brave.removeItem(item);
      brave.items.should.not.include(item);
      return brave.items.should.be.empty;
    });
    return it('should not remove no include item', function() {
      var another;
      another = new Item;
      brave.items.should.not.be.empty;
      brave.items.should.include(item);
      brave.items.should.not.include(another);
      brave.removeItem(another);
      brave.items.should.not.be.empty;
      brave.items.should.include(item);
      return brave.items.should.not.include(another);
    });
  });
  return describe('#details()', function() {
    var item;
    item = new Item;
    beforeEach(function() {
      return brave.items = [item];
    });
    return it('should return brave details', function() {
      var details;
      details = brave.details();
      should.exist(details);
      details.should.be.an["instanceof"](Object);
      should.exist(details.id, 'id should exist');
      details.id.should.equal(brave.id);
      should.exist(details.name, 'name should exist');
      details.name.should.equal('testBrave');
      should.exist(details.lv, 'lv should exist');
      details.lv.should.equal(1);
      should.exist(details.atk, 'atk should exist');
      details.atk.should.equal(1);
      should.exist(details.matk, 'matk should exist');
      details.matk.should.equal(1);
      should.exist(details.hp, 'hp should exist');
      details.hp.should.equal(10);
      should.exist(details.mp, 'mp should exist');
      details.mp.should.equal(10);
      should.exist(details.brave, 'brave should exist');
      details.brave.should.equal(50);
      should.exist(details.faith, 'faith should exist');
      details.faith.should.equal(50);
      should.exist(details.speed, 'speed should exist');
      details.speed.should.equal(3);
      should.exist(details.gold, 'gold should exist');
      details.gold.should.equal(300);
      should.exist(details.items, 'items should exist');
      details.items.should.be.an["instanceof"](Array);
      details.items[0].should.be.an["instanceof"](Object);
      return details.items[0].id.should.equal(item.id);
    });
  });
});
