var ActionInfo, BraveInfo, ItemInfo, SpotInfo, clientLibPath, should;

should = require('should');

clientLibPath = '../../../lib/trifolium-client';

BraveInfo = require("" + clientLibPath + "/braveInfo").BraveInfo;

ActionInfo = require("" + clientLibPath + "/actionInfo").ActionInfo;

ItemInfo = require("" + clientLibPath + "/itemInfo").ItemInfo;

SpotInfo = require("" + clientLibPath + "/spotInfo").SpotInfo;

describe('BraveInfo', function() {
  var braveInfo;
  braveInfo = new BraveInfo({
    id: '69a851de6ac432459caa017441e0d94f0e80352a',
    name: 'ポワスケ',
    lv: 1,
    atk: 1,
    matk: 1,
    hp: 10,
    mp: 10,
    brave: 50,
    faith: 50,
    speed: 53,
    gold: 300,
    items: [
      new ItemInfo({
        id: '28733e5e7c135e41a8c734f15283b6a186335846',
        name: 'いいきのこ',
        itemId: 2
      })
    ],
    action: new ActionInfo({
      time: 7211.102550927979,
      name: 'move',
      from: '26a93c17ec27e9918b25f9a3b4169a603f474174',
      to: 'de0cde838525b7e8f7ef586b2ed62a816a295760'
    }),
    actionProcess: 0.4997848767989314,
    spot: new SpotInfo({
      id: '83ba0e93ae676c7d2c0589baaff223d41aed064c'
    }),
    destination: new SpotInfo({
      id: 'de0cde838525b7e8f7ef586b2ed62a816a295760'
    })
  });
  it('should have id', function() {
    should.exist(braveInfo.id);
    return braveInfo.id.should.equal('69a851de6ac432459caa017441e0d94f0e80352a');
  });
  it('should have name', function() {
    should.exist(braveInfo.name);
    return braveInfo.name.should.equal('ポワスケ');
  });
  it('should have lv', function() {
    should.exist(braveInfo.lv);
    return braveInfo.lv.should.equal(1);
  });
  it('should have atk', function() {
    should.exist(braveInfo.atk);
    return braveInfo.atk.should.equal(1);
  });
  it('should have matk', function() {
    should.exist(braveInfo.matk);
    return braveInfo.matk.should.equal(1);
  });
  it('should have hp', function() {
    should.exist(braveInfo.hp);
    return braveInfo.hp.should.equal(10);
  });
  it('should have mp', function() {
    should.exist(braveInfo.mp);
    return braveInfo.mp.should.equal(10);
  });
  it('should have brave', function() {
    should.exist(braveInfo.brave);
    return braveInfo.brave.should.equal(50);
  });
  it('should have faith', function() {
    should.exist(braveInfo.faith);
    return braveInfo.faith.should.equal(50);
  });
  it('should have speed', function() {
    should.exist(braveInfo.speed);
    return braveInfo.speed.should.equal(53);
  });
  it('should have gold', function() {
    should.exist(braveInfo.gold);
    return braveInfo.gold.should.equal(300);
  });
  it('should have items', function() {
    should.exist(braveInfo.items);
    braveInfo.items.should.be.an["instanceof"](Array);
    braveInfo.items[0].should.be.an["instanceof"](ItemInfo);
    return braveInfo.items[0].id.should.equal('28733e5e7c135e41a8c734f15283b6a186335846');
  });
  it('should have action', function() {
    should.exist(braveInfo.action);
    braveInfo.action.should.be.an["instanceof"](ActionInfo);
    return braveInfo.action.name.should.be.equal;
  });
  it('should have actionProcess', function() {
    should.exist(braveInfo.actionProcess);
    return braveInfo.actionProcess.should.equal(0.4997848767989314);
  });
  it('should have spot', function() {
    should.exist(braveInfo.spot);
    braveInfo.spot.should.be.an["instanceof"](SpotInfo);
    return braveInfo.spot.id.should.equal('83ba0e93ae676c7d2c0589baaff223d41aed064c');
  });
  it('should have destination', function() {
    should.exist(braveInfo.destination);
    braveInfo.destination.should.be.an["instanceof"](SpotInfo);
    return braveInfo.destination.id.should.equal('de0cde838525b7e8f7ef586b2ed62a816a295760');
  });
  describe('#addItem()', function() {
    var info;
    info = new BraveInfo({});
    return it('should add item', function() {
      var item;
      item = 'dummy item';
      info.items.should.be.empty;
      info.addItem(item);
      info.items.should.not.be.empty;
      return info.items.should.include(item);
    });
  });
  describe('#updateActionProcess()', function() {
    var info;
    info = new BraveInfo({
      speed: 50,
      actionProcess: 0.0,
      action: new ActionInfo({
        time: 10000,
        name: 'wait'
      })
    });
    return it('should update actionProcess', function() {
      info.actionProcess.should.equal(0.0);
      info.updateActionProcess(30);
      return info.actionProcess.should.equal(0.15);
    });
  });
  return describe('#updateAction()', function() {
    var info;
    info = new BraveInfo({
      actionProcess: 0.5
    });
    return it('should update actionProcess', function() {
      info.actionProcess.should.equal(0.5);
      info.updateAction('dummy action');
      return info.actionProcess.should.equal(0.0);
    });
  });
});
