var Dungeon, SearchEvent, SerchEventProcess, config, configFile, fs, serverLibPath, should, _ref;

should = require('should');

fs = require('fs');

serverLibPath = '../../../lib/trifolium-server';

Dungeon = require("" + serverLibPath + "/dungeon").Dungeon;

_ref = require("" + serverLibPath + "/event"), SearchEvent = _ref.SearchEvent, SerchEventProcess = _ref.SerchEventProcess;

configFile = './config.json';

config = JSON.parse(fs.readFileSync(configFile));

describe('Dungeon', function() {
  var dungeon;
  dungeon = null;
  beforeEach(function() {
    return dungeon = new Dungeon({
      name: 'testDungeon',
      floors: []
    });
  });
  it('should have name', function() {
    return dungeon.name.should.equal('testDungeon');
  });
  it('should have floors', function() {
    return dungeon.floors.should.be.an["instanceof"](Array);
  });
  return describe('#pickEvent', function() {
    beforeEach(function() {
      return dungeon = new Dungeon({
        name: 'testDungeon',
        floors: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
      });
    });
    it('should return null if invalid floor', function() {
      var event;
      event = dungeon.pickEvent(4);
      return should.not.exist(event);
    });
    return it('should return Event', function() {
      var event;
      event = dungeon.pickEvent(1);
      should.exist(event);
      return event.should.be.within(4, 6);
    });
  });
});
