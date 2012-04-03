(function() {
  var Simulator, config, configFilePath, fs, simulator;

  fs = require('fs');

  Simulator = require('./lib/trifolium-server/simulator').Simulator;

  configFilePath = './config.json';

  config = JSON.parse(fs.readFileSync(configFilePath));

  simulator = new Simulator(config.simulator);

  simulator.on('braveCompleteAction', function(brave, action, result) {
    return console.log({
      brave: brave.id,
      completeAction: action.details(),
      result: result,
      nextAction: brave.action.details()
    });
  });

  simulator.start();

}).call(this);
