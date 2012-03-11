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
      return notifier.notify('completeAction', {
        brave: brave.id,
        completeAction: action.details(),
        result: result,
        nextAction: brave.action.details()
      });
    });
  }

  simulator.start();

}).call(this);
