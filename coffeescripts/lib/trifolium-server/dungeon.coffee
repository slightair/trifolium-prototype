class Dungeon
    constructor: (dungeonInfo) ->
        @name = dungeonInfo.name ? "unknown"
        @floors = dungeonInfo.floors ? []
    
    pickEvent: (f) ->
        return null unless @floors.length > f
        
        floor = @floors[f].sort (a, b) -> 0.5 - Math.random()
        index = parseInt(Math.random() * floor.length)
        floor[index]
    
exports.Dungeon = Dungeon
