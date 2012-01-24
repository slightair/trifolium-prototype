var Simulator;

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
