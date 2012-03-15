var ActionInfo, clientLibPath, should;

should = require('should');

clientLibPath = '../../../lib/trifolium-client';

ActionInfo = require("" + clientLibPath + "/actionInfo").ActionInfo;

describe('ActionInfo', function() {
  describe('WaitActionInfo', function() {
    var actionInfo;
    actionInfo = new ActionInfo({
      time: 3000,
      name: 'wait'
    });
    it('should have name', function() {
      should.exist(actionInfo.name);
      return actionInfo.name.should.equal('wait');
    });
    it('should have time', function() {
      should.exist(actionInfo.time);
      return actionInfo.time.should.equal(3000);
    });
    return it('should have optionalInfoDict', function() {
      should.exist(actionInfo.optionalInfoDict);
      return actionInfo.optionalInfoDict.should.be.an["instanceof"](Object);
    });
  });
  describe('MoveActionInfo', function() {
    var actionInfo;
    actionInfo = new ActionInfo({
      time: 7211.102550927979,
      name: 'move',
      from: '26a93c17ec27e9918b25f9a3b4169a603f474174',
      to: 'de0cde838525b7e8f7ef586b2ed62a816a295760'
    });
    it('should have name', function() {
      should.exist(actionInfo.name);
      return actionInfo.name.should.equal('move');
    });
    it('should have time', function() {
      should.exist(actionInfo.time);
      return actionInfo.time.should.equal(7211.102550927979);
    });
    return it('should have optionalInfoDict', function() {
      should.exist(actionInfo.optionalInfoDict);
      actionInfo.optionalInfoDict.should.be.an["instanceof"](Object);
      should.exist(actionInfo.optionalInfoDict.from);
      actionInfo.optionalInfoDict.from.should.equal('26a93c17ec27e9918b25f9a3b4169a603f474174');
      should.exist(actionInfo.optionalInfoDict.to);
      return actionInfo.optionalInfoDict.to.should.equal('de0cde838525b7e8f7ef586b2ed62a816a295760');
    });
  });
  return describe('SearchActionInfo', function() {
    var actionInfo;
    actionInfo = new ActionInfo({
      time: 5000,
      name: 'search'
    });
    it('should have name', function() {
      should.exist(actionInfo.name);
      return actionInfo.name.should.equal('search');
    });
    it('should have time', function() {
      should.exist(actionInfo.time);
      return actionInfo.time.should.equal(5000);
    });
    return it('should have optionalInfoDict', function() {
      should.exist(actionInfo.optionalInfoDict);
      return actionInfo.optionalInfoDict.should.be.an["instanceof"](Object);
    });
  });
});
