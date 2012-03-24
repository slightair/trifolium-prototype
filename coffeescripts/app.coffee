fs = require 'fs'
express = require 'express'
routes = require './routes'

configFilePath = './config.json'
config = JSON.parse(fs.readFileSync(configFilePath))

app = module.exports = express.createServer()

app.configure ->
    app.set "views", __dirname + "/views"
    app.set "view engine", "jade"
    app.use express.bodyParser()
    app.use express.methodOverride()
    app.use app.router
    app.use express.static(__dirname + "/public")
    app.set 'pusherTokenKey', config.notifier.pusherTokenKey
    app.set 'gameServerHost', (process.env.GAME_SERVER_HOST ? "http://localhost:6262")

app.configure "development", ->
    app.use express.errorHandler(
        dumpExceptions: true
        showStack: true
    )

app.configure "production", ->
    app.use express.errorHandler()

app.get "/", routes.index

port = process.env.PORT ? 3000
app.listen port
console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env
