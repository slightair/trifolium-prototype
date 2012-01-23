class Brave
    constructor: (name, spawnSpot) ->
        @name = name
        @lv    = 1
        @atk   = 1
        @matk  = 1
        @hp    = 10
        @mp    = 10
        @brave = 50
        @faith = 50
        @speed = 300
        @action = null
        @actionProcess = 0.0
        @spot = spawnSpot
    tick: ->
        if @action?
            @actionProcess += if @action.time > 0 then @speed / @action.time else 1.0
            if @actionProcess >= 1.0
                isSucceed = @action.do(@)
                