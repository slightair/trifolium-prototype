var Brave, SearchEvent, SearchEventProcess, library, serverLibPath, should, _ref;

should = require('should');

library = process.env['TRIFOLIUM_COV'] ? 'lib-cov' : 'lib';

serverLibPath = "../../../" + library + "/trifolium-server";

Brave = require("" + serverLibPath + "/brave").Brave;

_ref = require("" + serverLibPath + "/event"), SearchEvent = _ref.SearchEvent, SearchEventProcess = _ref.SearchEventProcess;

describe('SearchEvent', function() {
  var event;
  event = null;
  beforeEach(function() {
    var brave;
    brave = new Brave('testBrave');
    return event = new SearchEvent(brave, 3000, []);
  });
  it('should have type', function() {
    return event.type.should.equal('search');
  });
  it('should have time', function() {
    return event.time.should.equal(3000);
  });
  return it('should have treasureList', function() {
    return event.treasureList.should.be.an["instanceof"](Array);
  });
});

describe('SearchEventProcess', function() {
  var brave;
  brave = null;
  beforeEach(function() {
    return brave = new Brave('testBrave');
  });
  it('should call done', function(done) {
    var job;
    job = {
      data: new SearchEvent(brave, 1000)
    };
    return SearchEventProcess(job, done);
  });
  it('should return false over probabilityMax', function() {
    var job, result, treasureList;
    treasureList = [
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
    job = {
      data: new SearchEvent(brave, 3000, treasureList)
    };
    result = SearchEventProcess(job, function() {
      return null;
    });
    return result.isSucceed.should.not.be.ok;
  });
  it('should add item to brave', function() {
    var job, result, treasureList;
    treasureList = [
      {
        itemId: '1',
        probability: 1000
      }
    ];
    job = {
      data: new SearchEvent(brave, 3000, treasureList)
    };
    result = SearchEventProcess(job, function() {
      return null;
    });
    result.isSucceed.should.be.ok;
    return brave.items.should.include(result.treasure);
  });
  it('should return false if brave failed to get item', function() {
    var failure, i, job, result, success, treasureList;
    treasureList = [
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
    job = {
      data: new SearchEvent(brave, 3000, treasureList)
    };
    for (i = 1; i <= 50; i++) {
      brave.items = [];
      result = SearchEventProcess(job, function() {
        return null;
      });
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
    var job, result, treasureList;
    treasureList = [
      {
        itemId: '1',
        probability: 1000
      }
    ];
    job = {
      data: new SearchEvent(brave, 3000, treasureList)
    };
    brave.items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    result = SearchEventProcess(job, function() {
      return null;
    });
    result.isSucceed.should.not.be.ok;
    return brave.items.should.not.include(result.treasure);
  });
});
