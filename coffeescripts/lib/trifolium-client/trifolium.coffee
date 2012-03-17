if require?
    {Receiver} = require './receiver'
    {BraveInfo}  = require "./braveInfo"
    {ActionInfo} = require "./actionInfo"
    {ItemInfo}   = require "./itemInfo"
    {SpotInfo}   = require "./spotInfo"

class Trifolium
    constructor: (config) ->
        receiver = new Receiver config.websocketOptions
        
        @spotList = []
        @routeList = []
        @braveList = []
        @eventDict = {}
        
        # register events
        receiver.bind 'restoreGameStatus', @receiveRestoreGameStatus
        receiver.bind 'braveCompleteAction', @receiveBraveCompleteAction
    
    start: ->
        timer = setInterval( =>
            @tick()
        , @tickInterval)
        
    tick: ->
        brave.tick() for brave in @braveList
    
    spotForName: (name) -> (spot for spot in @spotList when spot.name == name)[0]
    
    spotForId: (id) -> (spot for spot in @spotList when spot.id == id)[0]
    
    braveForName: (name) -> (brave for brave in @braveList when brave.name == name)[0]
    
    braveForId: (id) -> (brave for brave in @braveList when brave.id == id)[0]
    
    on: (event, callback) ->
        @eventDict[event] = callback
        @
    
    emit: (event, args...) ->
        @eventDict[event]?.apply @, args
    
    restoreGameStatus: (details) ->
        coordinateBraveDetails = (d) =>
            d.items = (new ItemInfo itemInfo for itemInfo in d.items)
            d.action = new ActionInfo d.action
            d.spot = @spotForId d.spot
            d.destination = @spotForId d.destination
            d
        
        @tickInterval = if details.tickInterval < 100 then 100 else details.tickInterval
        @spotList = (new SpotInfo spotDetails for spotDetails in details.spotList)
        @braveList = (new BraveInfo coordinateBraveDetails braveDetails for braveDetails in details.braveList)
        @routeList = ([@spotForId(routeInfo[0]), @spotForId(routeInfo[1])] for routeInfo in details.routeList)
    
    #event callbacks
    receiveRestoreGameStatus: (details) =>
        @restoreGameStatus details
    
    receiveBraveCompleteAction: (details) =>
        brave = @braveForId details.brave
        prevAction = brave.action
        brave.setNextAction(new ActionInfo details.nextAction)
        @emit 'braveCompleteAction', brave, prevAction, details.result

exports?.Trifolium = Trifolium