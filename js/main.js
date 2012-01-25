var Action, Brave, MoveAction, SearchAction, Simulator, Spot, WaitAction, simulator,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

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

  function Simulator() {
    var brave, castle, castle2dungeonC, castle2townA, castle2townB, castle2townC, dungeonA, dungeonA2temple, dungeonB, dungeonB2townA, dungeonB2townB, dungeonC, dungeonC2castle, name, names, temple, temple2dungeonA, temple2townA, temple2townC, townA, townA2castle, townA2dungeonB, townA2temple, townB, townB2castle, townB2dungeonB, townC, townC2castle, townC2temple, _fn, _i, _len, _ref;
    townA = new Spot("townA", 20, -60);
    townB = new Spot("townB", -100, -20);
    townC = new Spot("townC", 20, 40);
    dungeonA = new Spot("dungeonA", 120, -80);
    dungeonB = new Spot("dungeonB", -60, -80);
    dungeonC = new Spot("dungeonC", -80, 60);
    castle = new Spot("castle", -40, 0);
    temple = new Spot("temple", 60, -20);
    townA2dungeonB = new MoveAction(townA, dungeonB);
    townA2castle = new MoveAction(townA, castle);
    townA2temple = new MoveAction(townA, temple);
    townB2dungeonB = new MoveAction(townB, dungeonB);
    townB2castle = new MoveAction(townB, castle);
    townC2castle = new MoveAction(townC, castle);
    townC2temple = new MoveAction(townC, temple);
    dungeonA2temple = new MoveAction(dungeonA, temple);
    dungeonB2townA = new MoveAction(dungeonB, townA);
    dungeonB2townB = new MoveAction(dungeonB, townB);
    dungeonC2castle = new MoveAction(dungeonC, castle);
    castle2townA = new MoveAction(castle, townA);
    castle2townB = new MoveAction(castle, townB);
    castle2townC = new MoveAction(castle, townC);
    castle2dungeonC = new MoveAction(castle, dungeonC);
    temple2townA = new MoveAction(temple, townA);
    temple2townC = new MoveAction(temple, townC);
    temple2dungeonA = new MoveAction(temple, dungeonA);
    townA.actions = [townA2dungeonB, townA2castle, townA2temple];
    townB.actions = [townB2dungeonB, townB2castle];
    townC.actions = [townC2castle, townC2temple];
    dungeonA.actions = [dungeonA2temple];
    dungeonB.actions = [dungeonB2townA, dungeonB2townB];
    dungeonC.actions = [dungeonC2castle];
    castle.actions = [castle2townA, castle2townB, castle2townC, castle2dungeonC];
    temple.actions = [temple2townA, temple2townC, temple2dungeonA];
    this.spotList = [townA, townB, townC, dungeonA, dungeonB, dungeonC, castle, temple];
    this.routeList = [townA2dungeonB, townA2castle, townA2temple, townB2dungeonB, townB2castle, townC2castle, townC2temple, dungeonA2temple, dungeonB2townA, dungeonB2townB, dungeonC2castle, castle2townA, castle2townB, castle2townC, castle2dungeonC, temple2townA, temple2townC, temple2dungeonA];
    names = ['anderson', 'bob', 'clarisse', 'daniel', 'eric', 'fredelic', 'george', 'heinkel', 'iris', 'jennifer'];
    this.braveList = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        _results.push(new Brave(name, castle, {
          speed: Math.floor(Math.random() * 50) + 20
        }));
      }
      return _results;
    })();
    _ref = this.braveList;
    _fn = function(brave) {
      var action, _ref2;
      action = brave.spot.randomAction();
      action.prepare(brave);
      brave.action = action;
      return brave.destination = (_ref2 = action.to) != null ? _ref2 : null;
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      brave = _ref[_i];
      _fn(brave);
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

simulator = new Simulator();

simulator.start();
