class Dungeon
    constructor: (dungeonInfo) ->
        @name = dungeonInfo.name ? "unknown"
        @floorList = dungeonInfo.floorList ? []
    
    pickEvent: (f) ->
        return null unless @floorList.length > f
        
        floor = @floorList[f].sort (a, b) -> 0.5 - Math.random()
        index = parseInt(Math.random() * floor.length)
        floor[index]
    
exports.Dungeon = Dungeon
