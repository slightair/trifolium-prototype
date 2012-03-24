(function() {
  var Notifier, Simulator, config, configFilePath, fs, notifier, port, server, simulator, url, _ref;

  fs = require('fs');

  url = require('url');

  Notifier = require('./lib/trifolium-server/notifier').Notifier;

  Simulator = require('./lib/trifolium-server/simulator').Simulator;

  configFilePath = './config.json';

  config = JSON.parse(fs.readFileSync(configFilePath));

  server = require('http').createServer(function(req, res) {
    if (url.parse(req.url).pathname === '/world/status' && req.method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(JSON.stringify(simulator.details()));
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      return res.end('Trifolium game server is running.\n');
    }
  });

  port = (_ref = process.env.PORT) != null ? _ref : 6262;

  server.listen(port);

  console.log("game server port: " + port);

  simulator = new Simulator(config.simulator);

  notifier = new Notifier(server, config.notifier);

  simulator.on('braveCompleteAction', function(brave, action, result) {
    return notifier.notify('braveCompleteAction', {
      brave: brave.id,
      completeAction: action.details(),
      result: result,
      nextAction: brave.action.details()
    });
  });

  simulator.start();

}).call(this);
