Trifolium = require('./lib/trifolium').Trifolium
settings = require('./settings').settings

simulator = new Trifolium settings
for brave in simulator.braveList
    brave.onCompleteAction = (brave, action, isSucceed) ->
        switch action.name
            when 'move'
                console.log "勇者#{brave.name} が #{action.to.name} に到着しました"
            when 'wait'
                console.log "勇者#{brave.name} はぼーっとしていた"
            when 'search'
                if isSucceed
                    console.log "勇者#{brave.name} は #{action.treasure.name} を手に入れた!"
                else
                    if action.treasure
                        console.log "勇者#{brave.name} は #{action.treasure} を見つけたが、これ以上アイテムを持てないのであきらめた…"
                    else
                        console.log "勇者#{brave.name} はアイテムを見つけられなかった…"
            else
                console.log "unknown event - #{action.name}"
simulator.start()