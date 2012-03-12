var Item, SearchAction, Spot, WaitAction, serverLibPath, should, _ref;

should = require('should');

serverLibPath = '../../../lib/trifolium-server';

Spot = require("" + serverLibPath + "/spot").Spot;

_ref = require("" + serverLibPath + "/action"), WaitAction = _ref.WaitAction, SearchAction = _ref.SearchAction;

Item = require("" + serverLibPath + "/item").Item;

describe("Spot", function() {
  var spot;
  spot = new Spot('testSpot', 0, 0, [
    {
      type: 'wait',
      time: 3000
    }, {
      type: 'wait',
      time: 4000
    }, {
      type: 'wait',
      time: 5000
    }, {
      type: 'search',
      time: 5000,
      treasures: [
        {
          itemId: 1,
          probability: 500
        }, {
          itemId: 2,
          name: '輝くきのこ',
          probability: 100
        }
      ]
    }
  ]);
  it('should have id', function() {
    return should.exist(spot.id);
  });
  it('should have name', function() {
    return spot.name.should.equal('testSpot');
  });
  it('should have posX', function() {
    return spot.posX.should.equal(0);
  });
  it('should have posY', function() {
    return spot.posY.should.equal(0);
  });
  it('should have actions', function() {
    var action, searchActions, waitActions;
    spot.actions.should.be.an["instanceof"](Array);
    waitActions = (function() {
      var _i, _len, _ref2, _results;
      _ref2 = spot.actions;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        action = _ref2[_i];
        if (action.name === 'wait') _results.push(action);
      }
      return _results;
    })();
    waitActions.should.not.empty;
    waitActions[0].should.be.an["instanceof"](WaitAction);
    searchActions = (function() {
      var _i, _len, _ref2, _results;
      _ref2 = spot.actions;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        action = _ref2[_i];
        if (action.name === 'search') _results.push(action);
      }
      return _results;
    })();
    searchActions.should.not.empty;
    return searchActions[0].should.be.an["instanceof"](SearchAction);
  });
  describe('#randomAction()', function() {
    return it('should be return a random action', function() {
      var action, i, id, item, searchActionCount, treasureInfo, waitActionCount, _ref2;
      waitActionCount = 0;
      searchActionCount = 0;
      for (i = 1; i <= 20; i++) {
        action = spot.randomAction();
        switch (action.name) {
          case 'wait':
            action.should.be.an["instanceof"](WaitAction);
            action.time.should.be.within(3000, 5000);
            waitActionCount += 1;
            break;
          case 'search':
            action.should.be.an["instanceof"](SearchAction);
            action.treasureDict.should.be.an["instanceof"](Object);
            _ref2 = action.treasureDict;
            for (id in _ref2) {
              treasureInfo = _ref2[id];
              item = treasureInfo.item;
              item.should.be.an["instanceof"](Item);
              switch (item.itemId) {
                case 1:
                  item.name.should.equal('きのこ');
                  break;
                case 2:
                  item.name.should.equal('輝くきのこ');
                  break;
                default:
                  should.not.exist(item, 'unknown item');
              }
            }
            searchActionCount += 1;
            break;
          default:
            action.name.should.not.be.an["instanceof"](Action, 'unknown action');
        }
      }
      waitActionCount.should.above(1, 'waitActionCount');
      searchActionCount.should.above(1, 'searchActionCount');
      return (waitActionCount + searchActionCount).should.equal(20);
    });
  });
  return describe('#distance()', function() {
    return it('should be return distance between another spot', function() {
      var another;
      another = new Spot('another', 100, 0);
      spot.distance(another).should.equal(100);
      another = new Spot('another', 0, 20);
      spot.distance(another).should.equal(20);
      another = new Spot('another', 30, 40);
      return spot.distance(another).should.equal(50);
    });
  });
});