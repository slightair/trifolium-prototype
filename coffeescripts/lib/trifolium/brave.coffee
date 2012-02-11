class Brave
    constructor: (name, spawnSpot, options = {}) ->
        @listeners = []
        
        @name = name
        @lv    = options.lv    ? 1
        @atk   = options.atk   ? 1
        @matk  = options.matk  ? 1
        @hp    = options.hp    ? 10
        @mp    = options.mp    ? 10
        @brave = options.brave ? 50
        @faith = options.faith ? 50
        @speed = options.speed ? 3
        @action = null
        @actionProcess = 0.0
        @spot = spawnSpot
        @destination = spawnSpot
    tick: ->
        if @action?
            @actionProcess += if @action.time > 0 then @speed / @action.time else 1.0
            if @actionProcess >= 1.0
                isSucceed = @action.do @
    
    addListener: (listener) ->
        @listeners.push listener
    removeListener: (remove) ->
        @listeners = (listener for listener in @listeners when listener != remove)
    doneAction: (action) ->
        listener.completeBraveAction(@, action) for listener in @listeners

exports?.Brave = Brave