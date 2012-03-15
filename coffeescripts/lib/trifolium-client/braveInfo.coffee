class BraveInfo
    constructor: (details) ->
        @id    = details.id    ? 'unknown'
        @name  = details.name  ? 'unknown'
        @lv    = details.lv    ? 1
        @atk   = details.atk   ? 1
        @matk  = details.matk  ? 1
        @hp    = details.hp    ? 10
        @mp    = details.mp    ? 10
        @brave = details.brave ? 50
        @faith = details.faith ? 50
        @speed = details.speed ? 3
        @gold  = details.gold  ? 300
        @items = details.items ? []
        @action = details.action ? null
        @actionProcess = details.actionProcess ? 0.0
        @spot = details.spot ? null
        @destination = details.destination ? null

exports?.BraveInfo = BraveInfo