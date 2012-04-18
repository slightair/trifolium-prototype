var Brave, BraveCreator, Dungeon, ItemCreator, Simulator, library, serverLibPath, should, _ref;

should = require('should');

library = process.env['TRIFOLIUM_COV'] ? 'lib-cov' : 'lib';

serverLibPath = "../../../" + library + "/trifolium-server";

Simulator = require("" + serverLibPath + "/simulator").Simulator;

ItemCreator = require("" + serverLibPath + "/item").ItemCreator;

_ref = require("" + serverLibPath + "/brave"), Brave = _ref.Brave, BraveCreator = _ref.BraveCreator;

Dungeon = require("" + serverLibPath + "/dungeon").Dungeon;

describe('Simulator', function() {
  var config, simulator;
  simulator = null;
  config = {
    dungeons: [
      {
        name: "なめこの洞窟",
        floors: [
          [
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
        ]
      }
    ],
    numBraves: 10,
    braveNameDict: {
      terms: ['1', '2', '3'],
      prefixes: ['A', 'B', 'C'],
      suffixes: ['a', 'b', 'c']
    },
    itemDict: {
      1: {
        name: 'きのこ'
      },
      2: {
        name: 'ちくわ'
      },
      3: {
        name: 'いいちくわ'
      }
    }
  };
  beforeEach(function() {
    return simulator = new Simulator;
  });
  it('should have dungeons', function() {
    simulator.dungeons.should.be.an["instanceof"](Array);
    return simulator.dungeons.should.empty;
  });
  it('should have braves', function() {
    simulator.braves.should.be.an["instanceof"](Array);
    return simulator.braves.should.empty;
  });
  it('should have jobs', function() {
    return should.exist(simulator.jobs);
  });
  describe('#start()', function() {
    beforeEach(function() {
      simulator = new Simulator;
      simulator.jobs = null;
      ItemCreator.setItemDict({});
      return BraveCreator.setBraveNameDict({
        terms: [],
        prefixes: [],
        suffixes: []
      });
    });
    it('should set ItemDict to ItemCreator', function() {
      ItemCreator.itemDict.should.not.have.keys('1', '2', '3');
      simulator.start(config);
      ItemCreator.itemDict.should.have.keys('1', '2', '3');
      return ItemCreator.itemDict['3'].name.should.equal('いいちくわ');
    });
    it('should set braveNameDict to BraveCreator', function() {
      BraveCreator.braveNamePrefixes.should.empty;
      BraveCreator.braveNameSuffixes.should.empty;
      simulator.start(config);
      BraveCreator.braveNamePrefixes.should.not.empty;
      return BraveCreator.braveNameSuffixes.should.not.empty;
    });
    it('should make dungeons', function() {
      simulator.dungeons.should.empty;
      simulator.start(config);
      simulator.dungeons.should.not.empty;
      simulator.dungeons.length.should.equal(1);
      return simulator.dungeons[0].name.should.equal("なめこの洞窟");
    });
    return it('should make braves', function() {
      simulator.braves.should.empty;
      simulator.start(config);
      simulator.braves.should.not.empty;
      return simulator.braves.length.should.equal(10);
    });
  });
  describe('#dungeonForId()', function() {
    var dungeonA, dungeonB, dungeonC, dungeonId;
    dungeonA = new Dungeon({
      name: 'hoge'
    });
    dungeonB = new Dungeon({
      name: 'fuga'
    });
    dungeonC = new Dungeon({
      name: 'piyo'
    });
    dungeonId = dungeonA.id;
    beforeEach(function() {
      return simulator.dungeons = [dungeonA, dungeonB, dungeonC];
    });
    it('should return null if dungeon not found', function() {
      var dungeon;
      dungeon = simulator.dungeonForId('unknownId');
      return should.not.exist(dungeon);
    });
    return it('should return dungeon if dungeon found', function() {
      var dungeon;
      dungeon = simulator.dungeonForId(dungeonId);
      should.exist(dungeon);
      dungeon.should.be.an["instanceof"](Dungeon);
      return dungeon.name.should.equal('hoge');
    });
  });
  return describe('#braveForId()', function() {
    var braveA, braveB, braveC, braveId;
    braveA = new Brave('hoge');
    braveB = new Brave('fuga');
    braveC = new Brave('piyo');
    braveId = braveA.id;
    beforeEach(function() {
      return simulator.braves = [braveA, braveB, braveC];
    });
    it('should return null if brave not found', function() {
      var brave;
      brave = simulator.braveForId('unknownId');
      return should.not.exist(brave);
    });
    return it('should return brave if brave found', function() {
      var brave;
      brave = simulator.braveForId(braveId);
      should.exist(brave);
      brave.should.be.an["instanceof"](Brave);
      return brave.name.should.equal('hoge');
    });
  });
});
