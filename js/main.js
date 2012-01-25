var Action, Brave, MoveAction, SearchAction, Simulator, Spot, WaitAction, settings, simulator,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

settings = {
  "spawnSpot": "castle",
  "spotList": [
    {
      "name": "townA",
      "posX": 20,
      "posY": -60
    }, {
      "name": "townB",
      "posX": -100,
      "posY": -20
    }, {
      "name": "townC",
      "posX": 20,
      "posY": 40
    }, {
      "name": "dungeonA",
      "posX": 120,
      "posY": -80
    }, {
      "name": "dungeonB",
      "posX": -60,
      "posY": -80
    }, {
      "name": "dungeonC",
      "posX": -80,
      "posY": 60
    }, {
      "name": "castle",
      "posX": -40,
      "posY": 0
    }, {
      "name": "temple",
      "posX": 60,
      "posY": -20
    }
  ],
  "routeList": [["townA", "dungeonB"], ["townA", "castle"], ["townA", "temple"], ["townB", "dungeonB"], ["townB", "castle"], ["townC", "castle"], ["townC", "temple"], ["dungeonA", "temple"], ["dungeonC", "castle"]],
  "braveNames": ['anderson', 'bob', 'clarisse', 'daniel', 'eric', 'fredelic', 'george', 'heinkel', 'iris', 'jennifer', 'kirby', 'leonard', 'michael', 'nick', 'orlando', 'pierre', 'qian', 'richard', 'sara', 'thomas', 'ulrich', 'veeder', 'walter', 'xavier', 'yakov', 'zach']
};

Brave = (function() {

  function Brave(name, spawnSpot, options) {
    var _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
    if (options == null) options = {};
    this.name = name;
    this.lv = (_ref = options.lv) != null ? _ref : 1;
    this.atk = (_ref2 = options.atk) != null ? _ref2 : 1;
    this.matk = (_ref3 = options.matk) != null ? _ref3 : 1;
    this.hp = (_ref4 = options.hp) != null ? _ref4 : 10;
    this.mp = (_ref5 = options.mp) != null ? _ref5 : 10;
    this.brave = (_ref6 = options.brave) != null ? _ref6 : 50;
    this.faith = (_ref7 = options.faith) != null ? _ref7 : 50;
    this.speed = (_ref8 = options.speed) != null ? _ref8 : 3;
    this.action = null;
    this.actionProcess = 0.0;
    this.spot = spawnSpot;
    this.destination = null;
  }

  Brave.prototype.tick = function() {
    var isSucceed;
    if (this.action != null) {
      this.actionProcess += this.action.time > 0 ? this.speed / this.action.time : 1.0;
      if (this.actionProcess >= 1.0) return isSucceed = this.action["do"](this);
    }
  };

  return Brave;

})();

Action = (function() {

  function Action() {
    this.name = null;
    this.isSucceed = false;
    this.time = 0;
  }

  Action.prototype.prepare = function(brave) {};

  Action.prototype["do"] = function(brave) {
    this.isSucceed = true;
    brave.action = null;
    return brave.actionProcess = 0.0;
  };

  return Action;

})();

WaitAction = (function(_super) {

  __extends(WaitAction, _super);

  function WaitAction() {
    WaitAction.__super__.constructor.apply(this, arguments);
    this.name = 'wait';
    this.time = 300;
  }

  return WaitAction;

})(Action);

MoveAction = (function(_super) {

  __extends(MoveAction, _super);

  function MoveAction(from, to) {
    MoveAction.__super__.constructor.apply(this, arguments);
    this.name = 'move';
    this.from = from;
    this.to = to;
    this.time = from.distance(to) * 100;
  }

  MoveAction.prototype["do"] = function(brave) {
    var nextAction, _ref;
    MoveAction.__super__["do"].call(this, brave);
    brave.spot = this.to;
    console.log("" + brave.name + " is arrived at " + this.to.name);
    nextAction = this.to.randomAction();
    nextAction.prepare(brave);
    brave.action = nextAction;
    brave.destination = (_ref = nextAction.to) != null ? _ref : null;
    return this.isSucceed;
  };

  return MoveAction;

})(Action);

SearchAction = (function(_super) {

  __extends(SearchAction, _super);

  SearchAction.prototype.probabilityMax = 1000;

  function SearchAction(treasureDict) {
    SearchAction.__super__.constructor.apply(this, arguments);
    this.name = 'search';
    this.treasureDict = treasureDict;
    this.treasure = null;
    this.time = 1000;
  }

  SearchAction.prototype["do"] = function(brave) {
    var i, needle, probabilities, probability, total, treasure, treasures, _len, _ref;
    SearchAction.__super__["do"].call(this, brave);
    total = 0;
    _ref = this.treasureDict;
    for (treasure in _ref) {
      probability = _ref[treasure];
      total += probability;
    }
    if (total > this.probabilityMax) return this.isSucceed = false;
    treasures = ((function() {
      var _ref2, _results;
      _ref2 = this.treasureDict;
      _results = [];
      for (treasure in _ref2) {
        probability = _ref2[treasure];
        _results.push(treasure);
      }
      return _results;
    }).call(this)).sort(function(a, b) {
      return 0.5 - Math.random();
    });
    probability = 0;
    probabilities = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = treasures.length; _i < _len; _i++) {
        treasure = treasures[_i];
        _results.push(probability += this.treasureDict[treasure]);
      }
      return _results;
    }).call(this);
    needle = Math.random() * this.probabilityMax;
    for (i = 0, _len = treasures.length; i < _len; i++) {
      treasure = treasures[i];
      if (!(this.treasure != null) && needle < probabilities[i]) {
        this.treasure = treasure;
      }
    }
    return this.isSucceed = this.treasure != null;
  };

  return SearchAction;

})(Action);

Spot = (function() {

  function Spot(name, posX, posY) {
    this.name = name;
    this.posX = posX;
    this.posY = posY;
    this.actions = [];
  }

  Spot.prototype.randomAction = function() {
    var index;
    index = Math.floor(Math.random() * this.actions.length);
    return this.actions[index];
  };

  Spot.prototype.distance = function(aSpot) {
    return Math.sqrt(Math.pow(this.posX - aSpot.posX, 2) + Math.pow(this.posY - aSpot.posY, 2));
  };

  return Spot;

})();

Simulator = (function() {

  function Simulator(settings) {
    var action, brave, moveAction, moveActionList, name, routeInfo, spawnSpot, spot, spot1, spot2, spotInfo, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _ref4;
    this.spotList = (function() {
      var _i, _len, _ref, _results;
      _ref = settings.spotList;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        spotInfo = _ref[_i];
        _results.push(new Spot(spotInfo.name, spotInfo.posX, spotInfo.posY));
      }
      return _results;
    })();
    this.routeList = [];
    moveActionList = [];
    _ref = settings.routeList;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      routeInfo = _ref[_i];
      spot1 = ((function() {
        var _j, _len2, _ref2, _results;
        _ref2 = this.spotList;
        _results = [];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          spot = _ref2[_j];
          if (spot.name === routeInfo[0]) _results.push(spot);
        }
        return _results;
      }).call(this))[0];
      spot2 = ((function() {
        var _j, _len2, _ref2, _results;
        _ref2 = this.spotList;
        _results = [];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          spot = _ref2[_j];
          if (spot.name === routeInfo[1]) _results.push(spot);
        }
        return _results;
      }).call(this))[0];
      moveActionList.push(new MoveAction(spot1, spot2));
      moveActionList.push(new MoveAction(spot2, spot1));
      this.routeList.push([spot1, spot2]);
    }
    spawnSpot = null;
    _ref2 = this.spotList;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      spot = _ref2[_j];
      spot.actions = (function() {
        var _k, _len3, _results;
        _results = [];
        for (_k = 0, _len3 = moveActionList.length; _k < _len3; _k++) {
          moveAction = moveActionList[_k];
          if (moveAction.from === spot) _results.push(moveAction);
        }
        return _results;
      })();
      if (spot.name === settings.spawnSpot) spawnSpot = spot;
    }
    this.braveList = (function() {
      var _k, _len3, _ref3, _results;
      _ref3 = settings.braveNames;
      _results = [];
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        name = _ref3[_k];
        _results.push(new Brave(name, spawnSpot, {
          speed: Math.floor(Math.random() * 50) + 20
        }));
      }
      return _results;
    })();
    _ref3 = this.braveList;
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      brave = _ref3[_k];
      action = brave.spot.randomAction();
      action.prepare(brave);
      brave.action = action;
      brave.destination = (_ref4 = action.to) != null ? _ref4 : null;
    }
  }

  Simulator.prototype.start = function() {
    var timer,
      _this = this;
    this.count = 0;
    return timer = setInterval(function() {
      _this.tick();
      return _this.count++;
    }, 30);
  };

  Simulator.prototype.tick = function() {
    var brave, _i, _len, _ref, _results;
    _ref = this.braveList;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      brave = _ref[_i];
      _results.push(brave.tick());
    }
    return _results;
  };

  return Simulator;

})();

simulator = new Simulator(settings);

simulator.start();
