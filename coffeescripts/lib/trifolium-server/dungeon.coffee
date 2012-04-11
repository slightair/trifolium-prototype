crypto = require 'crypto'

class Dungeon
    constructor: (dungeonInfo) ->
        date = new Date
        @name = dungeonInfo.name ? "unknown"
        @id = crypto.createHash('sha1').update("#{@name}")
                                       .update('bf75e9d57c76d607')
                                       .update("#{date.getTime()}")
                                       .update("#{date.getMilliseconds()}")
                                       .digest('hex')
        @floorList = dungeonInfo.floorList ? []
    
    pickEventInfo: (f) ->
        return null unless @floorList.length > f
        
        floor = @floorList[f].sort (a, b) -> 0.5 - Math.random()
        index = parseInt(Math.random() * floor.length)
        floor[index]
    
exports.Dungeon = Dungeon
