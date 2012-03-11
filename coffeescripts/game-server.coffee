{Notifier} = require('./lib/trifolium-server/notifier')
{Simulator} = require('./lib/trifolium-server/simulator')
{settings} = require('./settings')

simulator = new Simulator settings
notifier = new Notifier

for brave in simulator.braveList
    brave.on 'completeAction', (brave, action, result) ->
        notifier.notify 'completeAction',
            brave: brave.id
            completeAction: action.details()
            result: result
            nextAction: brave.action.details()
        
simulator.start()
