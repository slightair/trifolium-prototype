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
        @speed = 3
        @action = null
        @spot = spawnSpot
    tick: ->
        if @action?
            if (@action.tick @) > 1.0
                isSucceed = @action.do(@)
                @action.after(@)
                