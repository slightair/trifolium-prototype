var app, express, port, routes, _ref;

express = require("express");

routes = require("./routes");

app = module.exports = express.createServer();

app.configure(function() {
  app.set("views", __dirname + "/views");
  app.set("view engine", "jade");
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + "/public"));
  return app.set('gameServerHost', 'http://127.0.0.1:6262');
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

port = (_ref = process.env.PORT) != null ? _ref : 3000;

app.listen(port);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
