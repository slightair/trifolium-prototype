var Action, Brave, MoveAction, SearchAction, Spot, WaitAction, initialize, main, tick,
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
    var nextAction;
    MoveAction.__super__["do"].call(this, brave);
    console.log("" + brave.name + " is arrived at " + this.to.name);
    nextAction = this.to.randomAction();
    nextAction.prepare(brave);
    brave.action = nextAction;
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

initialize = function() {
  var brave, dungeon, dungeon2inn, inn, inn2dungeon, name, spawn2inn, spawnSpot, _i, _len, _results;
  spawnSpot = new Spot("spawn", 0, 0);
  inn = new Spot("inn", 50, 50);
  dungeon = new Spot("dungeon", 100, 50);
  spawn2inn = new MoveAction(spawnSpot, inn);
  inn2dungeon = new MoveAction(inn, dungeon);
  dungeon2inn = new MoveAction(dungeon, inn);
  spawnSpot.actions = [spawn2inn];
  inn.actions = [inn2dungeon];
  dungeon.actions = [dungeon2inn];
  this.spotList = [spawnSpot, inn, dungeon];
  this.braveList = (function() {
    var _i, _len, _ref, _results;
    _ref = ['armstrong', 'bob', 'clarisse'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      _results.push(new Brave(name, spawnSpot, {
        speed: Math.floor(Math.random() * 100) + 10
      }));
    }
    return _results;
  })();
  _results = [];
  for (_i = 0, _len = braveList.length; _i < _len; _i++) {
    brave = braveList[_i];
    _results.push((function(brave) {
      var action;
      action = spawnSpot.randomAction();
      action.prepare(brave);
      return brave.action = action;
    })(brave));
  }
  return _results;
};

main = function() {
  var count, timer;
  initialize();
  count = 0;
  return timer = setInterval(function() {
    console.log("" + (count++));
    tick();
    if (count > 100) return clearInterval(timer);
  }, 30);
};

tick = function() {
  var brave, _i, _len, _ref, _results;
  _ref = this.braveList;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    brave = _ref[_i];
    _results.push(brave.tick());
  }
  return _results;
};

main();
