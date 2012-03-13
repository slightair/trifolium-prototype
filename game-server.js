(function() {
  var Notifier, Simulator, brave, config, configFilePath, fs, notifier, simulator, _i, _len, _ref;

  fs = require('fs');

  Notifier = require('./lib/trifolium-server/notifier').Notifier;

  Simulator = require('./lib/trifolium-server/simulator').Simulator;

  configFilePath = './config.json';

  config = JSON.parse(fs.readFileSync(configFilePath));

  simulator = new Simulator(config);

  notifier = new Notifier({
    mode: 'socket.io',
    port: 6262
  });

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
