class Brave
    constructor: (@name, spawnSpot, options = {}) ->
        @lv    = options.lv    ? 1
        @atk   = options.atk   ? 1
        @matk  = options.matk  ? 1
        @hp    = options.hp    ? 10
        @mp    = options.mp    ? 10
        @brave = options.brave ? 50
        @faith = options.faith ? 50
        @speed = options.speed ? 3
        @gold  = options.gold  ? 300
        @items = options.items ? []
        @action = null
        @actionProcess = 0.0
        @spot = spawnSpot
        @destination = spawnSpot
        @eventDict = {}
    
    on: (event, callback) ->
        @eventDict[event] = callback
        @
    
    emit: (event, args...) ->
        @eventDict[event]?.apply @, args
    
    tick: ->
        if @action?
            @actionProcess += if @action.time > 0 then @speed / @action.time else 1.0
            if @actionProcess >= 1.0
                prevAction = @action
                result = @action.do @
                
                @emit 'completeAction', @, prevAction, result
    
    addItem: (item) ->
        if @items.length < 10
            @items.push item 
            true
        else
            false
    
    removeItem: (item) ->
        @items = (i for i in @items when i != item)
    
exports?.Brave = Brave