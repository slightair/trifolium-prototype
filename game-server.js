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

  notifier.on('connection', function(connection) {
    return connection.notify('restoreGameStatus', simulator.details());
  });

  simulator.start();

}).call(this);
