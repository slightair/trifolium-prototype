(function() {
  var Trifolium, brave, settings, simulator, _i, _len, _ref;

  Trifolium = require('./lib/trifolium').Trifolium;

  settings = require('./settings').settings;

  simulator = new Trifolium(settings);

  _ref = simulator.braveList;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    brave = _ref[_i];
    brave.onCompleteAction = function(brave, action, isSucceed) {
      switch (action.name) {
        case 'move':
          return console.log("勇者" + brave.name + " が " + action.to.name + " に到着しました");
        case 'wait':
          return console.log("勇者" + brave.name + " はぼーっとしていた");
        case 'search':
          if (isSucceed) {
            return console.log("勇者" + brave.name + " は " + action.treasure.name + " を手に入れた!");
          } else {
            if (action.treasure) {
              return console.log("勇者" + brave.name + " は " + action.treasure.name + " を見つけたが、これ以上アイテムを持てないのであきらめた…");
            } else {
              return console.log("勇者" + brave.name + " はアイテムを見つけられなかった…");
            }
          }
          break;
        default:
          return console.log("unknown event - " + action.name);
      }
    };
  }

  simulator.start();

}).call(this);
