{Receiver} = require './lib/trifolium-client/receiver'
{settings} = require './settings'

receiver = new Receiver {mode: 'socket.io', host: "http://localhost:6262"}
receiver.bind 'completeAction', (details) ->
    console.log details






# switch action.name
#     when 'move'
#         notifier.notify 'eventlog', "勇者#{brave.name} が #{action.to.name} に到着しました"
#     when 'wait'
#         notifier.notify 'eventlog', "勇者#{brave.name} はぼーっとしていた"
#     when 'search'
#         if result.isSucceed
#             notifier.notify 'eventlog', "勇者#{brave.name} は #{result.treasure.name} を手に入れた!"
#         else
#             if action.treasure
#                 notifier.notify 'eventlog', "勇者#{brave.name} は #{result.treasure.name} を見つけたが、これ以上アイテムを持てないのであきらめた…"
#             else
#                 notifier.notify 'eventlog', "勇者#{brave.name} はアイテムを見つけられなかった…"
#     else
#         notifier.notify 'eventlog', "unknown event - #{action.name}"