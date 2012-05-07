fs = require 'fs'
kue = require 'kue'
{Simulator} = require './lib/trifolium-server/simulator'

kue.app.listen 3100

configFilePath = './config.json'
config = JSON.parse(fs.readFileSync(configFilePath))

simulator = new Simulator

# event callbacks
simulator.on 'completeEvent', (brave, event, result) ->
    switch event.type
        when 'search'
            if result.isSucceed
                console.log "勇者#{brave.name}は#{result.treasure.name}を手に入れた!"
            else
                if result.treasure
                    console.log "勇者#{brave.name}は#{result.treasure.name}を見つけたが、持ち物がいっぱいなのであきらめた…"
                else
                    console.log "勇者#{brave.name}はアイテムを見つけられなかった…"
        else
            console.log "unknown event complete."

simulator.start config.simulator