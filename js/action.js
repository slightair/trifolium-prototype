var Action, MoveAction, SearchAction, WaitAction,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

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
