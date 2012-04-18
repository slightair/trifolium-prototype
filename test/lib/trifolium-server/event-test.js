var Brave, SearchEvent, library, serverLibPath, should;

should = require('should');

library = process.env['TRIFOLIUM_COV'] ? 'lib-cov' : 'lib';

serverLibPath = "../../../" + library + "/trifolium-server";

Brave = require("" + serverLibPath + "/brave").Brave;

SearchEvent = require("" + serverLibPath + "/event").SearchEvent;

describe('SearchEvent', function() {
  var event;
  event = null;
  beforeEach(function() {
    return event = new SearchEvent([]);
  });
  it('should have type', function() {
    return event.type.should.equal('search');
  });
  it('should have treasures', function() {
    return event.treasures.should.be.an["instanceof"](Array);
  });
  return describe('#process()', function() {
    var brave;
    brave = null;
    beforeEach(function() {
      return brave = new Brave('testBrave');
    });
    it('should return false over probabilityMax', function() {
      var result, treasures;
      treasures = [
        {
          itemId: '1',
          probability: 500
        }, {
          itemId: '2',
          probability: 500
        }, {
          itemId: '3',
          probability: 500
        }
      ];
      event = new SearchEvent(treasures);
      result = event.process(brave);
      return result.isSucceed.should.not.be.ok;
    });
    it('should add item to brave', function() {
      var result, treasures;
      treasures = [
        {
          itemId: '1',
          probability: 1000
        }
      ];
      event = new SearchEvent(treasures);
      result = event.process(brave);
      result.isSucceed.should.be.ok;
      return brave.items.should.include(result.treasure);
    });
    it('should return false if brave failed to get item', function() {
      var failure, i, result, success, treasures;
      treasures = [
        {
          itemId: '1',
          probability: 400
        }, {
          itemId: '2',
          probability: 100
        }
      ];
      success = 0;
      failure = 0;
      event = new SearchEvent(treasures);
      for (i = 1; i <= 50; i++) {
        brave.items = [];
        result = event.process(brave);
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
      var result, treasures;
      treasures = [
        {
          itemId: '1',
          probability: 1000
        }
      ];
      event = new SearchEvent(treasures);
      brave.items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      result = event.process(brave);
      result.isSucceed.should.not.be.ok;
      return brave.items.should.not.include(result.treasure);
    });
  });
});
