var Game, itemDict, settings,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
  var SharedItemCreator, game;
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
    var item, paramName, paramNames, _i, _j, _len, _len2, _ref, _results;
    paramNames = ['name', 'lv', 'atk', 'matk', 'hp', 'mp', 'brave', 'faith', 'speed'];
    for (_i = 0, _len = paramNames.length; _i < _len; _i++) {
      paramName = paramNames[_i];
      $("#brave-" + paramName + "-value").text(brave[paramName]);
    }
    $("#brave-position-value").text("" + brave.spot.name);
    $("#brave-action-value").text("" + brave.action.name);
    $("#brave-item-table tbody").empty();
    _ref = brave.items;
    _results = [];
    for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
      item = _ref[_j];
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
    var brave, markerSize, route, selectedBraveMarker, spot, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3,
      _this = this;
    _ref = this.simulator.routeList;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      route = _ref[_i];
      this.appendRoute(route);
    }
    _ref2 = this.simulator.spotList;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      spot = _ref2[_j];
      this.appendSpot(spot);
    }
    _ref3 = this.simulator.braveList;
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      brave = _ref3[_k];
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
    var centerLineColor, gapX, gapY, gridSize, lineColor, x, y, _ref, _ref2;
    gridSize = 10 * this.mapScale;
    lineColor = 'rgba(0, 0, 255, 0.1)';
    centerLineColor = 'rgba(0, 0, 255, 0.5)';
    gapX = this.canvas.width % gridSize / 2;
    gapY = this.canvas.height % gridSize / 2;
    for (y = 0, _ref = this.canvas.height / gridSize; 0 <= _ref ? y < _ref : y > _ref; 0 <= _ref ? y++ : y--) {
      if (y !== this.canvas.height / 2 / gridSize) {
        this.canvas.append(new Line(0, y * gridSize + gapY, this.canvas.width, y * gridSize + gapY, {
          stroke: lineColor
        }));
      }
    }
    for (x = 0, _ref2 = this.canvas.width / gridSize; 0 <= _ref2 ? x < _ref2 : x > _ref2; 0 <= _ref2 ? x++ : x--) {
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
