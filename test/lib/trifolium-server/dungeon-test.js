var Dungeon, Floor, library, serverLibPath, should, _ref;

should = require('should');

library = process.env['TRIFOLIUM_COV'] ? 'lib-cov' : 'lib';

serverLibPath = "../../../" + library + "/trifolium-server";

_ref = require("" + serverLibPath + "/dungeon"), Floor = _ref.Floor, Dungeon = _ref.Dungeon;

describe('Floor', function() {
  var floor;
  floor = null;
  return describe('#pickEventInfo()', function() {
    beforeEach(function() {
      return floor = new Floor({
        _id: 'floorA',
        number: 1,
        events: [
          {
            type: "search",
            treasures: [
              {
                "itemId": 2,
                "probability": 100
              }
            ]
          }
        ]
      });
    });
    it('should return null if floor has no event', function() {
      var eventInfo;
      floor.events = [];
      eventInfo = floor.pickEventInfo();
      return should.not.exist(eventInfo);
    });
    return it('should return eventInfo', function() {
      var eventInfo;
      eventInfo = floor.pickEventInfo();
      should.exist(eventInfo);
      return eventInfo.type.should.equal("search");
    });
  });
});

describe('Dungeon', function() {
  var dungeon;
  dungeon = null;
  beforeEach(function() {
    return dungeon = new Dungeon({
      _id: 'dungeonId',
      name: 'testDungeon',
      floors: []
    });
  });
  it('should have name', function() {
    return dungeon.name.should.equal('testDungeon');
  });
  it('should have id', function() {
    return dungeon.id.should.equal('dungeonId');
  });
  return it('should have floors', function() {
    return dungeon.floors.should.be.an["instanceof"](Array);
  });
});
