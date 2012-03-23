fs = require 'fs'
{Notifier} = require './lib/trifolium-server/notifier'
{Simulator} = require './lib/trifolium-server/simulator'

configFilePath = './config.json'
config = JSON.parse(fs.readFileSync(configFilePath))

simulator = new Simulator config.simulator
notifier = new Notifier config.notifier

notifier.on 'connection', (connection) ->
    connection.notify 'restoreGameStatus', simulator.details()

simulator.on 'braveCompleteAction', (brave, action, result) ->
    notifier.notify 'braveCompleteAction',
        brave: brave.id
        completeAction: action.details()
        result: result
        nextAction: brave.action.details()

simulator.start()
