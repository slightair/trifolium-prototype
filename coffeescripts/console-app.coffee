Trifolium = require('./lib/trifolium').Trifolium
settings = require('./settings').settings

simulator = new Trifolium(settings)
for brave in simulator.braveList
    brave.onCompleteAction = (brave, action, isSucceed) ->
        switch action.name
            when 'move'
                console.log "#{brave.name} is arrived at #{action.to.name}"
            when 'wait'
                console.log "#{brave.name} is waiting..."
simulator.start()