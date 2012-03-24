fs = require 'fs'
url = require 'url'
{Notifier} = require './lib/trifolium-server/notifier'
{Simulator} = require './lib/trifolium-server/simulator'

configFilePath = './config.json'
config = JSON.parse(fs.readFileSync(configFilePath))

# http server
server = require('http').createServer (req, res) ->
    if url.parse(req.url).pathname == '/world/status' && req.method == 'GET'
        res.writeHead 200,
            'Content-Type': 'application/json; charset=utf-8'
            'Access-Control-Allow-Origin': '*'
        res.end JSON.stringify simulator.details()
    else
        res.writeHead 200,
            'Content-Type': 'text/plain'
        res.end 'Trifolium game server is running.\n'
port = process.env.PORT ? 6262
server.listen port
console.log "game server port: #{port}"

simulator = new Simulator config.simulator
notifier = new Notifier server, config.notifier

# event callbacks
simulator.on 'braveCompleteAction', (brave, action, result) ->
    notifier.notify 'braveCompleteAction',
        brave: brave.id
        completeAction: action.details()
        result: result
        nextAction: brave.action.details()

simulator.start()
