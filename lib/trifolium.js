var Action, Brave, MoveAction, SearchAction, Spot, Trifolium, WaitAction, _ref;

if (typeof require !== "undefined" && require !== null) {
  Brave = require('./trifolium/brave').Brave;
  Spot = require('./trifolium/spot').Spot;
  _ref = require('./trifolium/action'), Action = _ref.Action, WaitAction = _ref.WaitAction, MoveAction = _ref.MoveAction, SearchAction = _ref.SearchAction;
}

Trifolium = (function() {

  function Trifolium(settings) {
    var action, brave, braveNameList, moveAction, moveActionList, name, routeInfo, routeInfoList, spawnSpot, spawnSpotName, spot, spot1, spot2, spotInfo, spotInfoList, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref2, _ref3, _ref4;
    spotInfoList = settings.spotInfoList, routeInfoList = settings.routeInfoList, spawnSpotName = settings.spawnSpotName, braveNameList = settings.braveNameList;
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
    this.braveList = (function() {
      var _l, _len4, _results;
      _results = [];
      for (_l = 0, _len4 = braveNameList.length; _l < _len4; _l++) {
        name = braveNameList[_l];
        _results.push(new Brave(name, spawnSpot, {
          speed: Math.floor(Math.random() * 50) + 20
        }));
      }
      return _results;
    })();
    _ref3 = this.braveList;
    for (_l = 0, _len4 = _ref3.length; _l < _len4; _l++) {
      brave = _ref3[_l];
      brave.addListener(this);
      action = brave.spot.randomAction();
      action.prepare(brave);
      brave.action = action;
      brave.destination = (_ref4 = action.to) != null ? _ref4 : brave.spot;
    }
  }

  Trifolium.prototype.start = function() {
    var timer,
      _this = this;
    this.count = 0;
    return timer = setInterval(function() {
      _this.tick();
      return _this.count++;
    }, 30);
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

  Trifolium.prototype.completeBraveAction = function(brave, action) {
    switch (action.name) {
      case 'move':
        return console.log("" + brave.name + " is arrived at " + action.to.name);
      case 'wait':
        return console.log("" + brave.name + " is waiting...");
    }
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

  return Trifolium;

})();

if (typeof exports !== "undefined" && exports !== null) {
  exports.Trifolium = Trifolium;
}
