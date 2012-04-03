class Dungeon
    constructor: (dungeonInfo) ->
        @name = dungeonInfo.name ? "unknown"
        @eventList = (new Event eventInfo for eventInfo in (dungeonInfo.eventList ? []))
    
exports.Dungeon = Dungeon
