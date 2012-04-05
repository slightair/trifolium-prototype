var Brave, ItemCreator, SearchEvent, SerchEventProcess, config, configFile, fs, serverLibPath, should, _ref;

should = require('should');

fs = require('fs');

serverLibPath = '../../../lib/trifolium-server';

Brave = require("" + serverLibPath + "/brave").Brave;

_ref = require("" + serverLibPath + "/event"), SearchEvent = _ref.SearchEvent, SerchEventProcess = _ref.SerchEventProcess;

ItemCreator = require("" + serverLibPath + "/item").ItemCreator;

configFile = './config.json';

config = JSON.parse(fs.readFileSync(configFile));

ItemCreator.setItemDict(config.simulator.itemDict);

describe('SearchEvent', function() {
  var event;
  event = null;
  beforeEach(function() {
    var brave;
    brave = new Brave('testBrave');
    return event = new SearchEvent(brave, 3000, {});
  });
  it('should have type', function() {
    return event.type.should.equal('search');
  });
  it('should have time', function() {
    return event.time.should.equal(3000);
  });
  it('should have probabilityMax', function() {
    return event.probabilityMax.should.equal(1000);
  });
  it('should have treasureDict', function() {
    return event.treasureDict.should.be.an["instanceof"](Object);
  });
  return describe('#process()', function() {
    var brave, goodKinoko, kinoko, tikuwa;
    kinoko = ItemCreator.create(1);
    goodKinoko = ItemCreator.create(2);
    tikuwa = ItemCreator.create(3);
    brave = null;
    beforeEach(function() {
      return brave = new Brave('testBrave');
    });
    it('should return Object', function() {
      return event.process().should.be.an["instanceof"](Object);
    });
    it('should return false over probabilityMax', function() {
      var failureEvent, result, treasureDict;
      treasureDict = {};
      treasureDict[kinoko.id] = {
        item: kinoko,
        probability: 500
      };
      treasureDict[goodKinoko.id] = {
        item: goodKinoko,
        probability: 500
      };
      treasureDict[tikuwa.id] = {
        item: tikuwa,
        probability: 500
      };
      failureEvent = new SearchEvent(brave, 3000, treasureDict);
      result = failureEvent.process();
      return result.isSucceed.should.not.be.ok;
    });
    it('should add item to brave', function() {
      var result, successEvent, treasureDict;
      treasureDict = {};
      treasureDict[kinoko.id] = {
        item: kinoko,
        probability: 1000
      };
      successEvent = new SearchEvent(brave, 3000, treasureDict);
      result = successEvent.process();
      result.isSucceed.should.be.ok;
      brave.items.should.include(kinoko);
      return result.treasure.should.equal(kinoko);
    });
    it('should return false if brave failed to get item', function() {
      var failure, i, randomEvent, result, success, treasureDict;
      treasureDict = {};
      treasureDict[kinoko.id] = {
        item: kinoko,
        probability: 500
      };
      success = 0;
      failure = 0;
      randomEvent = new SearchEvent(brave, 3000, treasureDict);
      for (i = 1; i <= 50; i++) {
        brave.items = [];
        result = randomEvent.process();
        if (result.treasure) {
          result.isSucceed.should.be.ok;
          success += 1;
        } else {
          result.isSucceed.should.not.be.ok;
          failure += 1;
        }
      }
      success.should.above(10);
      return failure.should.above(10);
    });
    return it('should return false if brave cannot take a getting item', function() {
      var failureEvent, result, treasureDict;
      treasureDict = {};
      treasureDict[kinoko.id] = {
        item: kinoko,
        probability: 1000
      };
      failureEvent = new SearchEvent(brave, 3000, treasureDict);
      brave.items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      result = failureEvent.process();
      result.isSucceed.should.not.be.ok;
      return result.treasure.should.equal(kinoko);
    });
  });
});
