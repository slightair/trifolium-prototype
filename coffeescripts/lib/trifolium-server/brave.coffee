crypto = require 'crypto'
{EventEmitter} = require 'events'

class Brave extends EventEmitter
    constructor: (@name, spawnSpot, options = {}) ->
        date = new Date
        @id    = crypto.createHash('sha1').update("#{@name}")
                                          .update("#{spawnSpot.name}")
                                          .update('b9889216daa1ccab')
                                          .update("#{date.getTime()}")
                                          .update("#{date.getMilliseconds()}")
                                          .digest('hex')
        @lv    = options.lv    ? 1
        @atk   = options.atk   ? 1
        @matk  = options.matk  ? 1
        @hp    = options.hp    ? 10
        @mp    = options.mp    ? 10
        @brave = options.brave ? 50
        @faith = options.faith ? 50
        @speed = options.speed ? 3
        @gold  = options.gold  ? 300
        @items = options.items ? []
        @action = null
        @actionProcess = 0.0
        @spot = spawnSpot
        @destination = spawnSpot
    
    tick: ->
        if @action?
            @actionProcess += if @action.time > 0 then @speed / @action.time else 1.0
            if @actionProcess >= 1.0
                prevAction = @action
                result = @action.do @
                
                @emit 'completeAction', @, prevAction, result
    
    addItem: (item) ->
        if @items.length < 10
            @items.push item 
            true
        else
            false
    
    removeItem: (item) ->
        @items = (i for i in @items when i != item)
    
    details: ->
        id: @id
        name: @name
        lv: @lv
        atk: @atk
        matk: @matk
        hp: @hp
        mp: @mp
        brave: @brave
        faith: @faith
        speed: @speed
        gold: @gold
        items: (item.details() for item in @items)
        action: if @action then @action.details() else null
        actionProcess: @actionProcess
        spot: @spot?.id
        destination: @destination?.id
    
exports.Brave = Brave