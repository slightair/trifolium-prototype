var Action, Brave, Game, Item, ItemCreator, MoveAction, SearchAction, SharedItemCreator, Spot, Trifolium, WaitAction, itemDict, settings, _ref, _ref2,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
  __slice = Array.prototype.slice,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Action = (function() {

  function Action() {
    this.name = null;
    if (this.time == null) this.time = 0;
  }

  Action.prototype.prepare = function(brave) {};

  Action.prototype["do"] = function(brave) {
    brave.action = null;
    brave.actionProcess = 0.0;
    return {
      isSucceed: false
    };
  };

  Action.prototype.after = function(brave, nextAction) {
    var _ref;
    nextAction.prepare(brave);
    brave.action = nextAction;
    return brave.destination = (_ref = nextAction.to) != null ? _ref : brave.spot;
  };

  return Action;

})();

WaitAction = (function(_super) {

  __extends(WaitAction, _super);

  function WaitAction(time) {
    this.time = time;
    WaitAction.__super__.constructor.apply(this, arguments);
    this.name = 'wait';
  }

  WaitAction.prototype["do"] = function(brave) {
    WaitAction.__super__["do"].call(this, brave);
    this.after(brave, brave.spot.randomAction());
    return {
      isSucceed: true
    };
  };

  return WaitAction;

})(Action);

MoveAction = (function(_super) {

  __extends(MoveAction, _super);

  function MoveAction(from, to) {
    this.from = from;
    this.to = to;
    MoveAction.__super__.constructor.apply(this, arguments);
    this.name = 'move';
    this.time = this.from.distance(this.to) * 100;
  }

  MoveAction.prototype["do"] = function(brave) {
    MoveAction.__super__["do"].call(this, brave);
    brave.spot = this.to;
    this.after(brave, this.to.randomAction());
    return {
      isSucceed: true
    };
  };

  return MoveAction;

})(Action);

SearchAction = (function(_super) {

  __extends(SearchAction, _super);

  SearchAction.prototype.probabilityMax = 1000;

  function SearchAction(time, treasureDict) {
    this.time = time;
    this.treasureDict = treasureDict != null ? treasureDict : {};
    SearchAction.__super__.constructor.apply(this, arguments);
    this.name = 'search';
  }

  SearchAction.prototype["do"] = function(brave) {
    var i, id, isSucceed, needle, probabilities, probability, total, treasure, treasureIds, treasureInfo, _len, _ref;
    SearchAction.__super__["do"].call(this, brave);
    total = 0;
    _ref = this.treasureDict;
    for (id in _ref) {
      treasureInfo = _ref[id];
      total += treasureInfo.probability;
    }
    if (total > this.probabilityMax) {
      return {
        isSucceed: false,
        treasure: null
      };
    }
    treasureIds = ((function() {
      var _ref2, _results;
      _ref2 = this.treasureDict;
      _results = [];
      for (id in _ref2) {
        treasureInfo = _ref2[id];
        _results.push(id);
      }
      return _results;
    }).call(this)).sort(function(a, b) {
      return 0.5 - Math.random();
    });
    probability = 0;
    probabilities = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = treasureIds.length; _i < _len; _i++) {
        id = treasureIds[_i];
        _results.push(probability += this.treasureDict[id].probability);
      }
      return _results;
    }).call(this);
    needle = Math.random() * this.probabilityMax;
    for (i = 0, _len = treasureIds.length; i < _len; i++) {
      id = treasureIds[i];
      if (!(typeof treasure !== "undefined" && treasure !== null) && needle < probabilities[i]) {
        treasure = this.treasureDict[id].item;
      }
    }
    isSucceed = null;
    if (treasure && brave.addItem(treasure)) {
      isSucceed = true;
    } else {
      isSucceed = false;
    }
    this.after(brave, brave.spot.randomAction());
    return {
      isSucceed: isSucceed,
      treasure: treasure
    };
  };

  return SearchAction;

})(Action);

if (typeof exports !== "undefined" && exports !== null) exports.Action = Action;

if (typeof exports !== "undefined" && exports !== null) {
  exports.WaitAction = WaitAction;
}

if (typeof exports !== "undefined" && exports !== null) {
  exports.MoveAction = MoveAction;
}

if (typeof exports !== "undefined" && exports !== null) {
  exports.SearchAction = SearchAction;
}

Brave = (function() {

  function Brave(name, spawnSpot, options) {
    var _ref, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
    this.name = name;
    if (options == null) options = {};
    this.lv = (_ref = options.lv) != null ? _ref : 1;
    this.atk = (_ref2 = options.atk) != null ? _ref2 : 1;
    this.matk = (_ref3 = options.matk) != null ? _ref3 : 1;
    this.hp = (_ref4 = options.hp) != null ? _ref4 : 10;
    this.mp = (_ref5 = options.mp) != null ? _ref5 : 10;
    this.brave = (_ref6 = options.brave) != null ? _ref6 : 50;
    this.faith = (_ref7 = options.faith) != null ? _ref7 : 50;
    this.speed = (_ref8 = options.speed) != null ? _ref8 : 3;
    this.gold = (_ref9 = options.gold) != null ? _ref9 : 300;
    this.items = (_ref10 = options.items) != null ? _ref10 : [];
    this.action = null;
    this.actionProcess = 0.0;
    this.spot = spawnSpot;
    this.destination = spawnSpot;
    this.eventDict = {};
  }

  Brave.prototype.on = function(event, callback) {
    this.eventDict[event] = callback;
    return this;
  };

  Brave.prototype.emit = function() {
    var args, event, _ref;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return (_ref = this.eventDict[event]) != null ? _ref.apply(this, args) : void 0;
  };

  Brave.prototype.tick = function() {
    var prevAction, result;
    if (this.action != null) {
      this.actionProcess += this.action.time > 0 ? this.speed / this.action.time : 1.0;
      if (this.actionProcess >= 1.0) {
        prevAction = this.action;
        result = this.action["do"](this);
        return this.emit('completeAction', this, prevAction, result);
      }
    }
  };

  Brave.prototype.addItem = function(item) {
    if (this.items.length < 10) {
      this.items.push(item);
      return true;
    } else {
      return false;
    }
  };

  Brave.prototype.removeItem = function(item) {
    var i;
    return this.items = (function() {
      var _i, _len, _ref, _results;
      _ref = this.items;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if (i !== item) _results.push(i);
      }
      return _results;
    }).call(this);
  };

  return Brave;

})();

if (typeof exports !== "undefined" && exports !== null) exports.Brave = Brave;

if (typeof require !== "undefined" && require !== null) {
  itemDict = require('../../settings').itemDict;
}

Item = (function() {

  function Item(itemId, name) {
    var date;
    this.itemId = itemId;
    this.name = name;
    date = new Date;
    this.id = "" + (date.getTime()) + (date.getMilliseconds()) + this.itemId + this.name;
  }

  return Item;

})();

ItemCreator = (function() {

  function ItemCreator(itemDict) {
    this.itemDict = itemDict;
  }

  ItemCreator.prototype.createItem = function(itemId, name) {
    if (name == null) name = null;
    if (this.itemDict[itemId] != null) {
      return new Item(itemId, name != null ? name : this.itemDict[itemId].name);
    } else {
      return null;
    }
  };

  return ItemCreator;

})();

if (typeof exports !== "undefined" && exports !== null) exports.Item = Item;

if (typeof exports !== "undefined" && exports !== null) {
  exports.ItemCreator = ItemCreator;
}

if (typeof exports !== "undefined" && exports !== null) {
  exports.SharedItemCreator = new ItemCreator(itemDict);
}

if (typeof require !== "undefined" && require !== null) {
  _ref = require('./action'), Action = _ref.Action, WaitAction = _ref.WaitAction, MoveAction = _ref.MoveAction, SearchAction = _ref.SearchAction;
  SharedItemCreator = require('./item').SharedItemCreator;
}

Spot = (function() {

  function Spot(name, posX, posY, actionInfoList) {
    this.name = name;
    this.posX = posX;
    this.posY = posY;
    if (actionInfoList == null) actionInfoList = [];
    this.actions = this.makeActions(actionInfoList);
  }

  Spot.prototype.randomAction = function() {
    var index;
    index = Math.floor(Math.random() * this.actions.length);
    return this.actions[index];
  };

  Spot.prototype.distance = function(aSpot) {
    return Math.sqrt(Math.pow(this.posX - aSpot.posX, 2) + Math.pow(this.posY - aSpot.posY, 2));
  };

  Spot.prototype.makeActions = function(actionInfoList) {
    var action, actionInfo, actions, item, treasureDict, treasureInfo, _i, _j, _len, _len2, _ref2;
    actions = [];
    if (actionInfoList != null) {
      for (_i = 0, _len = actionInfoList.length; _i < _len; _i++) {
        actionInfo = actionInfoList[_i];
        action = null;
        switch (actionInfo.type) {
          case 'wait':
            action = new WaitAction(actionInfo.time);
            break;
          case 'search':
            treasureDict = {};
            _ref2 = actionInfo.treasures;
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              treasureInfo = _ref2[_j];
              item = SharedItemCreator.createItem(treasureInfo.itemId, treasureInfo.name);
              treasureDict[item.id] = {
                item: item,
                probability: treasureInfo.probability
              };
            }
            action = new SearchAction(actionInfo.time, treasureDict);
        }
        if (action != null) actions.push(action);
      }
    }
    return actions;
  };

  return Spot;

})();

if (typeof exports !== "undefined" && exports !== null) exports.Spot = Spot;

if (typeof require !== "undefined" && require !== null) {
  Brave = require('./trifolium/brave').Brave;
  Spot = require('./trifolium/spot').Spot;
  _ref2 = require('./trifolium/action'), Action = _ref2.Action, WaitAction = _ref2.WaitAction, MoveAction = _ref2.MoveAction, SearchAction = _ref2.SearchAction;
}

Trifolium = (function() {

  function Trifolium(settings) {
    var action, brave, braveNameDictionary, dict, i, moveAction, moveActionList, numBraves, routeInfo, routeInfoList, spawnSpot, spawnSpotName, spot, spot1, spot2, spotInfo, spotInfoList, term, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _m, _n, _o, _p, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
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
    _ref3 = this.spotList;
    for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
      spot = _ref3[_j];
      for (_k = 0, _len3 = moveActionList.length; _k < _len3; _k++) {
        moveAction = moveActionList[_k];
        if (moveAction.from === spot) spot.actions.push(moveAction);
      }
    }
    _ref4 = [braveNameDictionary.prefixes, braveNameDictionary.terms];
    for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
      dict = _ref4[_l];
      for (_m = 0, _len5 = dict.length; _m < _len5; _m++) {
        term = dict[_m];
        ((_ref5 = this.braveNamePrefixes) != null ? _ref5 : this.braveNamePrefixes = []).push(term);
      }
    }
    _ref6 = [braveNameDictionary.suffixes, braveNameDictionary.terms];
    for (_n = 0, _len6 = _ref6.length; _n < _len6; _n++) {
      dict = _ref6[_n];
      for (_o = 0, _len7 = dict.length; _o < _len7; _o++) {
        term = dict[_o];
        ((_ref7 = this.braveNameSuffixes) != null ? _ref7 : this.braveNameSuffixes = []).push(term);
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
    _ref8 = this.braveList;
    for (_p = 0, _len8 = _ref8.length; _p < _len8; _p++) {
      brave = _ref8[_p];
      action = brave.spot.randomAction();
      action.prepare(brave);
      brave.action = action;
      brave.destination = (_ref9 = action.to) != null ? _ref9 : brave.spot;
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
    var brave, _i, _len, _ref3, _results;
    _ref3 = this.braveList;
    _results = [];
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      brave = _ref3[_i];
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
      var _i, _len, _ref3, _results;
      _ref3 = this.spotList;
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        spot = _ref3[_i];
        if (spot.name === name) _results.push(spot);
      }
      return _results;
    }).call(this))[0];
  };

  Trifolium.prototype.braveForName = function(name) {
    var brave;
    return ((function() {
      var _i, _len, _ref3, _results;
      _ref3 = this.braveList;
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        brave = _ref3[_i];
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

settings = {
  "tickInterval": 30,
  "spawnSpotName": "ちくわ城",
  "spotInfoList": [
    {
      "name": "こんぶシティー",
      "posX": 20,
      "posY": -60,
      "actions": [
        {
          "type": "wait",
          "time": 3000
        }
      ]
    }, {
      "name": "もずくタウン",
      "posX": -100,
      "posY": -20,
      "actions": [
        {
          "type": "wait",
          "time": 3000
        }
      ]
    }, {
      "name": "わかめビレッジ",
      "posX": 20,
      "posY": 40,
      "actions": [
        {
          "type": "wait",
          "time": 3000
        }
      ]
    }, {
      "name": "なめこの洞窟",
      "posX": 120,
      "posY": -80,
      "actions": [
        {
          "type": "wait",
          "time": 3000
        }, {
          "type": "search",
          "time": 5000,
          "treasures": [
            {
              "itemId": 1,
              "probability": 500
            }, {
              "itemId": 2,
              "probability": 100
            }
          ]
        }
      ]
    }, {
      "name": "たけのこ山",
      "posX": -60,
      "posY": -80,
      "actions": [
        {
          "type": "wait",
          "time": 3000
        }
      ]
    }, {
      "name": "かまぼこの迷宮",
      "posX": -80,
      "posY": 60,
      "actions": [
        {
          "type": "wait",
          "time": 3000
        }
      ]
    }, {
      "name": "ちくわ城",
      "posX": -40,
      "posY": 0,
      "actions": [
        {
          "type": "wait",
          "time": 3000
        }
      ]
    }, {
      "name": "たまねぎ寺院",
      "posX": 60,
      "posY": -20,
      "actions": [
        {
          "type": "wait",
          "time": 3000
        }
      ]
    }
  ],
  "routeInfoList": [["こんぶシティー", "たけのこ山"], ["こんぶシティー", "ちくわ城"], ["こんぶシティー", "たまねぎ寺院"], ["もずくタウン", "たけのこ山"], ["もずくタウン", "ちくわ城"], ["わかめビレッジ", "ちくわ城"], ["わかめビレッジ", "たまねぎ寺院"], ["なめこの洞窟", "たまねぎ寺院"], ["かまぼこの迷宮", "ちくわ城"]],
  "numBraves": 12,
  "braveNameDictionary": {
    "terms": ["ポチ", "タマ", "ヒロ", "チン", "ペロ", "ヒコ", "テル", "ユキ", "トロ", "リン", "ポコ", "タラ", "ナリ", "イチ", "ユウ", "ヨシ", "オリ", "タケ", "マサ", "タカ", "ナオ", "スケ", "ピヨ", "フウ", "ツネ", "ノロ", "ポロ", "ポポ", "トト", "テロ", "ピロ", "ポン", "ポワ", "ヨネ", "ウメ", "ノリ", "ロウ", "ゾウ", "ヤン", "ハン", "リィ", "オウ", "チィ", "ケン", "チヨ", "リリ", "ザム", "ラム", "ヒム", "タキ", "ザワ"],
    "prefixes": [],
    "suffixes": ["ミ", "カ", "コ", "リ", "ヨ", "エ", "ノ", "ッピ", "ッチ", "ッペ", "ヲ", "オ", "シ", "ス", "ッス", "ッツ", "ト", "ジ", "ザ", "ラ"]
  }
};

itemDict = {
  1: {
    name: 'きのこ'
  },
  2: {
    name: 'いいきのこ'
  },
  3: {
    name: 'ちくわ'
  },
  4: {
    name: 'いいちくわ'
  },
  5: {
    name: 'おにく'
  },
  6: {
    name: 'いいおにく'
  },
  10: {
    name: '竹の槍'
  }
};

if (typeof exports !== "undefined" && exports !== null) {
  exports.settings = settings;
}

if (typeof exports !== "undefined" && exports !== null) {
  exports.itemDict = itemDict;
}

$(function() {
  var game;
  SharedItemCreator = new ItemCreator(itemDict);
  game = new Game(580, 450);
  return game.start();
});

Game = (function() {

  function Game(width, height) {
    this.width = width;
    this.height = height;
    this.debugMatrix = __bind(this.debugMatrix, this);
    this.simulator = new Trifolium(settings);
    this.canvas = new Canvas($("#main-screen").get(0), this.width, this.height);
    this.infoLayer = new CanvasNode;
    this.mapScale = 2.0;
    this.selectedBrave = null;
    this.logMax = 6;
  }

  Game.prototype.appendRoute = function(route) {
    var routeColor, routeObject;
    routeColor = 'rgba(0, 255, 0, 0.2)';
    routeObject = new Line(this.canvas.width / 2 + route[0].posX * this.mapScale, this.canvas.height / 2 + route[0].posY * this.mapScale, this.canvas.width / 2 + route[1].posX * this.mapScale, this.canvas.height / 2 + route[1].posY * this.mapScale, {
      stroke: routeColor,
      strokeWidth: 10 * this.mapScale,
      lineCap: 'round'
    });
    return this.canvas.append(routeObject);
  };

  Game.prototype.appendSpot = function(spot) {
    var spotObject;
    spotObject = new Circle(10 * this.mapScale, {
      id: spot.name,
      x: this.canvas.width / 2 + spot.posX * this.mapScale,
      y: this.canvas.height / 2 + spot.posY * this.mapScale,
      stroke: 'rgba(0, 0, 255, 1.0)',
      strokeWidth: this.mapScale,
      endAngle: Math.PI * 2
    });
    return this.canvas.append(spotObject);
  };

  Game.prototype.appendBrave = function(brave) {
    var body, braveObject, color, head,
      _this = this;
    braveObject = new CanvasNode({
      id: brave.name,
      x: this.bravePosX(brave),
      y: this.bravePosY(brave),
      addedActionEffect: false
    });
    braveObject.addFrameListener(function(t, dt) {
      var actionProcessPercentage;
      braveObject.x = _this.bravePosX(brave);
      braveObject.y = _this.bravePosY(brave);
      if (brave === _this.selectedBrave) {
        actionProcessPercentage = (brave.actionProcess * 100).toFixed(1);
        $("#brave-actionProcess-bar").text("" + actionProcessPercentage + "%");
        return $("#brave-actionProcess-bar").css("width", "" + actionProcessPercentage + "%");
      }
    });
    braveObject.addEventListener('mousedown', function(event) {
      _this.selectedBrave = brave;
      return _this.displayBraveInfo(brave);
    });
    color = "hsla(" + (parseInt(Math.random() * 360)) + ", 70%, 50%, 1.0)";
    head = new Circle(2 * this.mapScale, {
      x: 0,
      y: -2 * this.mapScale,
      fill: color,
      endAngle: Math.PI * 2
    });
    body = new Rectangle(4 * this.mapScale, 4 * this.mapScale, {
      x: -2 * this.mapScale,
      y: 0,
      fill: color
    });
    braveObject.append(head);
    braveObject.append(body);
    this.canvas.append(braveObject);
    return brave.on('completeAction', function(brave, action, result) {
      var actionEffect, circleRadiusMax, effectTime;
      circleRadiusMax = 40.0;
      effectTime = 800;
      actionEffect = new Circle(1 * _this.mapScale, {
        x: 0,
        y: 0,
        stroke: "rgba(33, 66, 255, 0.8)",
        strokeWidth: _this.mapScale,
        fill: "rgba(33, 66, 255, 0.5)",
        endAngle: Math.PI * 2,
        opacity: 1.0
      });
      actionEffect.addFrameListener(function(t, dt) {
        if (dt > effectTime) actionEffect.removeSelf;
        actionEffect.radius += dt / effectTime * circleRadiusMax;
        actionEffect.opacity = (circleRadiusMax - actionEffect.radius) / circleRadiusMax;
        if (actionEffect.radius > circleRadiusMax) {
          actionEffect.removeSelf();
          return braveObject.addedActionEffect = false;
        }
      });
      if (!braveObject.addedActionEffect) {
        braveObject.append(actionEffect);
        braveObject.addedActionEffect = true;
      }
      if (brave === _this.selectedBrave) {
        $("#brave-position-value").text("" + brave.spot.name);
        $("#brave-action-value").text("" + brave.action.name);
        if (action.name === 'search' && result.isSucceed && result.treasure) {
          $("#brave-item-table tbody").append($("<tr><td></td><td>" + result.treasure.name + "</td></tr>"));
        }
      }
      switch (action.name) {
        case 'move':
          return _this.log("勇者" + (_this.logBraveName(brave.name)) + " が " + (_this.logSpotName(action.to.name)) + " に到着しました");
        case 'wait':
          return _this.log("勇者" + (_this.logBraveName(brave.name)) + " はぼーっとしていた");
        case 'search':
          if (result.isSucceed) {
            return _this.log("勇者" + (_this.logBraveName(brave.name)) + " は " + (_this.logItemName(result.treasure.name)) + " を手に入れた!");
          } else {
            if (action.treasure) {
              return _this.log("勇者" + (_this.logBraveName(brave.name)) + " は " + (_this.logItemName(result.treasure.name)) + " を見つけたが、これ以上アイテムを持てないのであきらめた…");
            } else {
              return _this.log("勇者" + (_this.logBraveName(brave.name)) + " はアイテムを見つけられなかった…");
            }
          }
          break;
        default:
          return _this.log("unknown event - " + action.name);
      }
    });
  };

  Game.prototype.displayBraveInfo = function(brave) {
    var item, paramName, paramNames, _i, _j, _len, _len2, _ref3, _results;
    paramNames = ['name', 'lv', 'atk', 'matk', 'hp', 'mp', 'brave', 'faith', 'speed'];
    for (_i = 0, _len = paramNames.length; _i < _len; _i++) {
      paramName = paramNames[_i];
      $("#brave-" + paramName + "-value").text(brave[paramName]);
    }
    $("#brave-position-value").text("" + brave.spot.name);
    $("#brave-action-value").text("" + brave.action.name);
    $("#brave-item-table tbody").empty();
    _ref3 = brave.items;
    _results = [];
    for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
      item = _ref3[_j];
      _results.push($("#brave-item-table tbody").append($("<tr><td></td><td>" + item.name + "</td></tr>")));
    }
    return _results;
  };

  Game.prototype.bravePosX = function(brave) {
    return this.canvas.width / 2 + (brave.spot.posX + (brave.destination.posX - brave.spot.posX) * brave.actionProcess) * this.mapScale;
  };

  Game.prototype.bravePosY = function(brave) {
    return this.canvas.height / 2 + (brave.spot.posY + (brave.destination.posY - brave.spot.posY) * brave.actionProcess) * this.mapScale;
  };

  Game.prototype.prepareDisplayObjects = function() {
    var brave, markerSize, route, selectedBraveMarker, spot, _i, _j, _k, _len, _len2, _len3, _ref3, _ref4, _ref5,
      _this = this;
    _ref3 = this.simulator.routeList;
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      route = _ref3[_i];
      this.appendRoute(route);
    }
    _ref4 = this.simulator.spotList;
    for (_j = 0, _len2 = _ref4.length; _j < _len2; _j++) {
      spot = _ref4[_j];
      this.appendSpot(spot);
    }
    _ref5 = this.simulator.braveList;
    for (_k = 0, _len3 = _ref5.length; _k < _len3; _k++) {
      brave = _ref5[_k];
      this.appendBrave(brave);
    }
    this.debugMatrix();
    markerSize = 16 * this.mapScale;
    selectedBraveMarker = new Rectangle(markerSize, markerSize, {
      rx: 4,
      ry: 4,
      x: -markerSize,
      y: -markerSize,
      fill: "rgba(255, 128, 0, 0.3)",
      stroke: "rgba(255, 128, 0, 0.5)",
      strokeWidth: this.mapScale,
      endAngle: Math.PI * 2
    });
    selectedBraveMarker.addFrameListener(function(t, dt) {
      if (_this.selectedBrave) {
        selectedBraveMarker.x = _this.bravePosX(_this.selectedBrave) - markerSize / 2;
        return selectedBraveMarker.y = _this.bravePosY(_this.selectedBrave) - markerSize / 2;
      }
    });
    this.canvas.append(selectedBraveMarker);
    this.infoLayer.append(new ElementNode(E('div', {
      id: 'log'
    }), {
      valign: "bottom",
      y: this.height
    }));
    return this.canvas.append(this.infoLayer);
  };

  Game.prototype.start = function() {
    this.prepareDisplayObjects();
    return this.simulator.start();
  };

  Game.prototype.log = function(text) {
    if (this.logMax <= $("div#log").children().length) {
      $("div#log").children(":first").remove();
    }
    return $("div#log").append($("<div class='logItem'>" + text + "</div>"));
  };

  Game.prototype.logBraveName = function(name) {
    return "<span class='log-brave-name'>" + name + "</span>";
  };

  Game.prototype.logSpotName = function(name) {
    return "<span class='log-spot-name'>" + name + "</span>";
  };

  Game.prototype.logItemName = function(name) {
    return "<span class='log-item-name'>" + name + "</span>";
  };

  Game.prototype.debugMatrix = function() {
    var centerLineColor, gapX, gapY, gridSize, lineColor, x, y, _ref3, _ref4;
    gridSize = 10 * this.mapScale;
    lineColor = 'rgba(0, 0, 255, 0.1)';
    centerLineColor = 'rgba(0, 0, 255, 0.5)';
    gapX = this.canvas.width % gridSize / 2;
    gapY = this.canvas.height % gridSize / 2;
    for (y = 0, _ref3 = this.canvas.height / gridSize; 0 <= _ref3 ? y < _ref3 : y > _ref3; 0 <= _ref3 ? y++ : y--) {
      if (y !== this.canvas.height / 2 / gridSize) {
        this.canvas.append(new Line(0, y * gridSize + gapY, this.canvas.width, y * gridSize + gapY, {
          stroke: lineColor
        }));
      }
    }
    for (x = 0, _ref4 = this.canvas.width / gridSize; 0 <= _ref4 ? x < _ref4 : x > _ref4; 0 <= _ref4 ? x++ : x--) {
      if (x !== this.canvas.width / 2 / gridSize) {
        this.canvas.append(new Line(x * gridSize + gapX, 0, x * gridSize + gapX, this.canvas.height, {
          stroke: lineColor
        }));
      }
    }
    this.canvas.append(new Line(0, this.canvas.height / 2, this.canvas.width, this.canvas.height / 2, {
      stroke: centerLineColor
    }));
    return this.canvas.append(new Line(this.canvas.width / 2, 0, this.canvas.width / 2, this.canvas.height, {
      stroke: centerLineColor
    }));
  };

  return Game;

})();
