var Dungeon, serverLibPath, should;

should = require('should');

serverLibPath = '../../../lib/trifolium-server';

Dungeon = require("" + serverLibPath + "/dungeon").Dungeon;

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
  return describe('#pickEvent()', function() {
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
