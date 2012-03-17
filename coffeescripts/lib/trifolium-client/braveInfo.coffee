class BraveInfo
    constructor: (details) ->
        @id    = details.id    ? 'unknown'
        @name  = details.name  ? 'unknown'
        @lv    = details.lv    ? 0
        @atk   = details.atk   ? 0
        @matk  = details.matk  ? 0
        @hp    = details.hp    ? 0
        @mp    = details.mp    ? 0
        @brave = details.brave ? 0
        @faith = details.faith ? 0
        @speed = details.speed ? 0
        @gold  = details.gold  ? 0
        @items = details.items ? []
        @action = details.action ? null
        @actionProcess = details.actionProcess ? 0.0
        @spot = details.spot ? null
        @destination = details.destination ? null
    
    tick: ->
        if @action? && @actionProcess < 1.0
            @actionProcess += if @action.time > 0 then @speed / @action.time else 1.0

exports?.BraveInfo = BraveInfo