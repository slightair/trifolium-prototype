if require?
    {Receiver} = require './receiver'

class Trifolium
    constructor: (config) ->
        receiver = new Receiver config.websocketOptions
        
        # event
        receiver.bind 'restoreGameStatus', @receiveRestoreGameStatus
        receiver.bind 'braveCompleteAction', @receiveBraveCompleteAction
    
    receiveRestoreGameStatus: (details) ->
        console.log details
    receiveBraveCompleteAction: (details) ->
        console.log details

exports?.Trifolium = Trifolium