{SearchEvent} = require './event'

class Floor
    constructor: (floorInfo) ->
        @id = floorInfo._id
        @number = floorInfo.number
        @events = (@createEvent info for info in floorInfo.events)
    
    createEvent: (info) ->
        event = null
        switch info.type
            when 'search'
                event = new SearchEvent info.treasures
        event
    
    pickEvent: ->
        return null if @events.length == 0
        
        events = @events.sort (a, b) -> 0.5 - Math.random()
        index = parseInt(Math.random() * events.length)
        events[index]

class Dungeon
    constructor: (dungeonInfo) ->
        @name = dungeonInfo.name ? 'unknown'
        @id = dungeonInfo._id
        @floors = (new Floor info for info in dungeonInfo.floors)

exports.Floor = Floor
exports.Dungeon = Dungeon