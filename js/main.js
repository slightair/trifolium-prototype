var Action, Brave, MoveAction, SearchAction, Spot, WaitAction, initialize, main, tick,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Brave = (function() {

  function Brave(name, spawnSpot) {
    this.name = name;
    this.lv = 1;
    this.atk = 1;
    this.matk = 1;
    this.hp = 10;
    this.mp = 10;
    this.brave = 50;
    this.faith = 50;
    this.speed = 3;
    this.action = null;
    this.spot = spawnSpot;
  }

  Brave.prototype.tick = function() {
    var isSucceed;
    if (this.action != null) {
      if ((this.action.tick(this)) > 1.0) {
        isSucceed = this.action["do"](this);
        return this.action.after(this);
      }
    }
  };

  return Brave;

})();

Action = (function() {

  function Action() {
    this.name = null;
    this.process = 0.0;
    this.isSucceed = false;
  }

  Action.prototype.prepare = function(brave) {};

  Action.prototype.tick = function(brave) {
    return this.process += brave.speed / 100;
  };

  Action.prototype["do"] = function(brave) {
    return this.isSucceed = true;
  };

  Action.prototype.after = function(brave) {
    return brave.action = null;
  };

  return Action;

})();

WaitAction = (function(_super) {

  __extends(WaitAction, _super);

  function WaitAction() {
    WaitAction.__super__.constructor.apply(this, arguments);
    this.name = 'wait';
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
  }

  MoveAction.prototype.after = function(brave) {
    MoveAction.__super__.after.call(this, brave);
    return console.log("" + brave.name + " is arrived at " + this.to.name);
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
  }

  SearchAction.prototype["do"] = function(brave) {
    var i, needle, probabilities, probability, total, treasure, treasures, _len, _ref;
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
    return Math.sqrt(Math.pow(this.posX - aSpot.posX) + Math.pow(this.posY - aSpot.posY));
  };

  return Spot;

})();

initialize = function() {
  var brave, i, inn, spawnSpot, _i, _len, _results;
  spawnSpot = new Spot("spawn", 0, 0);
  inn = new Spot("inn", 50, 50);
  spawnSpot.actions = [new MoveAction(spawnSpot, inn)];
  this.braveList = (function() {
    var _results;
    _results = [];
    for (i = 0; i < 3; i++) {
      _results.push(new Brave("no." + i, spawnSpot));
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
    if (count > 30) return clearInterval(timer);
  }, 100);
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
