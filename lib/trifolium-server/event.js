var ItemCreator, SearchEvent;

ItemCreator = require('./item').ItemCreator;

SearchEvent = (function() {

  SearchEvent.prototype.probabilityMax = 1000;

  function SearchEvent(treasureList) {
    this.treasureList = treasureList != null ? treasureList : [];
    this.type = 'search';
  }

  SearchEvent.prototype.process = function(brave) {
    var i, info, needle, probabilities, probability, result, total, treasure, treasureInfo, treasureList, _i, _len, _len2, _ref;
    total = 0;
    _ref = this.treasureList;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      info = _ref[_i];
      total += info.probability;
    }
    if (total > this.probabilityMax) {
      result = {
        isSucceed: false,
        treasure: null
      };
      this.save(result);
      return result;
    }
    treasureList = this.treasureList.sort(function(a, b) {
      return 0.5 - Math.random();
    });
    probability = 0;
    probabilities = (function() {
      var _j, _len2, _results;
      _results = [];
      for (_j = 0, _len2 = treasureList.length; _j < _len2; _j++) {
        info = treasureList[_j];
        _results.push(probability += info.probability);
      }
      return _results;
    })();
    needle = Math.random() * this.probabilityMax;
    for (i = 0, _len2 = treasureList.length; i < _len2; i++) {
      info = treasureList[i];
      if (!(typeof treasureInfo !== "undefined" && treasureInfo !== null) && needle < probabilities[i]) {
        treasureInfo = info;
      }
    }
    if (treasureInfo) {
      treasure = ItemCreator.create(treasureInfo.itemId, treasureInfo.name);
    }
    if (treasure && brave.addItem(treasure)) {
      result = {
        isSucceed: true,
        treasure: treasure
      };
      this.save(result);
    } else {
      result = {
        isSucceed: false,
        treasure: treasure
      };
      this.save(result);
    }
    return result;
  };

  SearchEvent.prototype.save = function(result) {};

  return SearchEvent;

})();

exports.SearchEvent = SearchEvent;
