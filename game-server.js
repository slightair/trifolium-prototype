(function() {
  var Notifier, Simulator, config, configFilePath, fs, notifier, simulator;

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

  simulator.on('braveCompleteAction', function(brave, action, result) {
    return notifier.notify('completeAction', {
      brave: brave.id,
      completeAction: action.details(),
      result: result,
      nextAction: brave.action.details()
    });
  });

  simulator.start();

}).call(this);
