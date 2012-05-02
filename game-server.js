(function() {
  var Simulator, config, configFilePath, fs, kue, simulator;

  fs = require('fs');

  kue = require('kue');

  Simulator = require('./lib/trifolium-server/simulator').Simulator;

  kue.app.listen(3100);

  configFilePath = './config.json';

  config = JSON.parse(fs.readFileSync(configFilePath));

  simulator = new Simulator;

  simulator.on('completeSearchEvent', function(brave, event, result) {
    return console.log(brave, event, result);
  });

  simulator.start(config.simulator);

}).call(this);
