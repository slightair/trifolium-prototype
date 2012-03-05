var Action, Brave, MoveAction, SearchAction, Spot, Trifolium, WaitAction, _ref;

if (typeof require !== "undefined" && require !== null) {
  Brave = require('./trifolium/brave').Brave;
  Spot = require('./trifolium/spot').Spot;
  _ref = require('./trifolium/action'), Action = _ref.Action, WaitAction = _ref.WaitAction, MoveAction = _ref.MoveAction, SearchAction = _ref.SearchAction;
}

Trifolium = (function() {

  function Trifolium(settings) {
    var action, brave, braveNameDictionary, dict, i, moveAction, moveActionList, numBraves, routeInfo, routeInfoList, spawnSpot, spawnSpotName, spot, spot1, spot2, spotInfo, spotInfoList, term, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _m, _n, _o, _p, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
    spotInfoList = settings.spotInfoList, routeInfoList = settings.routeInfoList, spawnSpotName = settings.spawnSpotName, braveNameDictionary = settings.braveNameDictionary, numBraves = settings.numBraves, this.tickInterval = settings.tickInterval;
    this.spotList = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = spotInfoList.length; _i < _len; _i++) {
        spotInfo = spotInfoList[_i];
        _results.push(new Spot(spotInfo.name, spotInfo.posX, spotInfo.posY, spotInfo.actions));
      }
      return _results;
    })();
    this.routeList = [];
    moveActionList = [];
    for (_i = 0, _len = routeInfoList.length; _i < _len; _i++) {
      routeInfo = routeInfoList[_i];
      spot1 = this.spotForName(routeInfo[0]);
      spot2 = this.spotForName(routeInfo[1]);
      moveActionList.push(new MoveAction(spot1, spot2));
      moveActionList.push(new MoveAction(spot2, spot1));
      this.routeList.push([spot1, spot2]);
    }
    spawnSpot = this.spotForName(spawnSpotName);
    _ref2 = this.spotList;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      spot = _ref2[_j];
      for (_k = 0, _len3 = moveActionList.length; _k < _len3; _k++) {
        moveAction = moveActionList[_k];
        if (moveAction.from === spot) spot.actions.push(moveAction);
      }
    }
    _ref3 = [braveNameDictionary.prefixes, braveNameDictionary.terms];
    for (_l = 0, _len4 = _ref3.length; _l < _len4; _l++) {
      dict = _ref3[_l];
      for (_m = 0, _len5 = dict.length; _m < _len5; _m++) {
        term = dict[_m];
        ((_ref4 = this.braveNamePrefixes) != null ? _ref4 : this.braveNamePrefixes = []).push(term);
      }
    }
    _ref5 = [braveNameDictionary.suffixes, braveNameDictionary.terms];
    for (_n = 0, _len6 = _ref5.length; _n < _len6; _n++) {
      dict = _ref5[_n];
      for (_o = 0, _len7 = dict.length; _o < _len7; _o++) {
        term = dict[_o];
        ((_ref6 = this.braveNameSuffixes) != null ? _ref6 : this.braveNameSuffixes = []).push(term);
      }
    }
    this.braveList = (function() {
      var _results;
      _results = [];
      for (i = 0; 0 <= numBraves ? i < numBraves : i > numBraves; 0 <= numBraves ? i++ : i--) {
        _results.push(new Brave(this.makeBraveName(braveNameDictionary), spawnSpot, {
          speed: Math.floor(Math.random() * 50) + 20
        }));
      }
      return _results;
    }).call(this);
    _ref7 = this.braveList;
    for (_p = 0, _len8 = _ref7.length; _p < _len8; _p++) {
      brave = _ref7[_p];
      action = brave.spot.randomAction();
      action.prepare(brave);
      brave.action = action;
      brave.destination = (_ref8 = action.to) != null ? _ref8 : brave.spot;
    }
  }

  Trifolium.prototype.start = function() {
    var timer,
      _this = this;
    this.count = 0;
    return timer = setInterval(function() {
      _this.tick();
      return _this.count++;
    }, this.tickInterval);
  };

  Trifolium.prototype.tick = function() {
    var brave, _i, _len, _ref2, _results;
    _ref2 = this.braveList;
    _results = [];
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      brave = _ref2[_i];
      _results.push(brave.tick());
    }
    return _results;
  };

  Trifolium.prototype.makeBraveName = function() {
    var prefixIndex, suffixIndex;
    prefixIndex = parseInt(Math.random() * this.braveNamePrefixes.length);
    suffixIndex = parseInt(Math.random() * this.braveNameSuffixes.length);
    return "" + this.braveNamePrefixes[prefixIndex] + this.braveNameSuffixes[suffixIndex];
  };

  Trifolium.prototype.spotForName = function(name) {
    var spot;
    return ((function() {
      var _i, _len, _ref2, _results;
      _ref2 = this.spotList;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        spot = _ref2[_i];
        if (spot.name === name) _results.push(spot);
      }
      return _results;
    }).call(this))[0];
  };

  Trifolium.prototype.braveForName = function(name) {
    var brave;
    return ((function() {
      var _i, _len, _ref2, _results;
      _ref2 = this.braveList;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        brave = _ref2[_i];
        if (brave.name === name) _results.push(brave);
      }
      return _results;
    }).call(this))[0];
  };

  return Trifolium;

})();

if (typeof exports !== "undefined" && exports !== null) {
  exports.Trifolium = Trifolium;
}
