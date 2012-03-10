(function() {
  var Notifier, Simulator, brave, notifier, settings, simulator, _i, _len, _ref;

  Notifier = require('./lib/trifolium-server/notifier').Notifier;

  Simulator = require('./lib/trifolium-server/simulator').Simulator;

  settings = require('./settings').settings;

  simulator = new Simulator(settings);

  notifier = new Notifier;

  _ref = simulator.braveList;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    brave = _ref[_i];
    brave.on('completeAction', function(brave, action, result) {
      switch (action.name) {
        case 'move':
          return notifier.notify('eventlog', "勇者" + brave.name + " が " + action.to.name + " に到着しました");
        case 'wait':
          return notifier.notify('eventlog', "勇者" + brave.name + " はぼーっとしていた");
        case 'search':
          if (result.isSucceed) {
            return notifier.notify('eventlog', "勇者" + brave.name + " は " + result.treasure.name + " を手に入れた!");
          } else {
            if (action.treasure) {
              return notifier.notify('eventlog', "勇者" + brave.name + " は " + result.treasure.name + " を見つけたが、これ以上アイテムを持てないのであきらめた…");
            } else {
              return notifier.notify('eventlog', "勇者" + brave.name + " はアイテムを見つけられなかった…");
            }
          }
          break;
        default:
          return notifier.notify('eventlog', "unknown event - " + action.name);
      }
    });
  }

  simulator.start();

}).call(this);
