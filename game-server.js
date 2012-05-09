(function() {
  var Simulator, config, configFilePath, fs, kue, simulator;

  fs = require('fs');

  kue = require('kue');

  Simulator = require('./lib/trifolium-server/simulator').Simulator;

  kue.app.listen(3100);

  configFilePath = './config.json';

  config = JSON.parse(fs.readFileSync(configFilePath));

  simulator = new Simulator;

  simulator.on('completeEvent', function(brave, event, result) {
    switch (event.type) {
      case 'search':
        if (result.isSucceed) {
          return console.log("勇者" + brave.name + "は" + result.treasure.name + "を手に入れた!");
        } else {
          if (result.treasure) {
            return console.log("勇者" + brave.name + "は" + result.treasure.name + "を見つけたが、持ち物がいっぱいなのであきらめた…");
          } else {
            return console.log("勇者" + brave.name + "はアイテムを見つけられなかった…");
          }
        }
        break;
      default:
        return console.log("unknown event complete.");
    }
  });

  simulator.start(config.simulator);

}).call(this);
