{Trifolium} = require './lib/trifolium-client/trifolium'

trifolium = new Trifolium config
trifolium.on 'braveCompleteAction', (brave, action, result) ->
    switch action.name
        when 'move'
            arrivalSpot = trifolium.spotForId action.optionalInfo.to
            console.log "勇者#{brave.name} が #{arrivalSpot.name} に到着しました"
        when 'wait'
            console.log "勇者#{brave.name} はぼーっとしていた"
        when 'search'
            if result.isSucceed
                console.log "勇者#{brave.name} は #{result.treasure.name} を手に入れた!"
            else
                if result.treasure
                    console.log "勇者#{brave.name} は #{result.treasure.name} を見つけたが、これ以上アイテムを持てないのであきらめた…"
                else
                    console.log "勇者#{brave.name} はアイテムを見つけられなかった…"
        else
            console.log 'eventlog', "unknown event - #{action.name}"

setInterval( ->,
10000000)