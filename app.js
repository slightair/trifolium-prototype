var app, express, fs, port, routes, _ref;

fs = require('fs');

express = require('express');

routes = require('./routes');

app = module.exports = express.createServer();

app.configure(function() {
  app.set("views", __dirname + "/views");
  app.set("view engine", "jade");
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  return app.use(express.static(__dirname + "/public"));
});

app.configure("development", function() {
  return app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure("production", function() {
  return app.use(express.errorHandler());
});

app.get("/", routes.index);

app.get("/history", routes.history);

port = (_ref = process.env.PORT) != null ? _ref : 3000;

app.listen(port);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
