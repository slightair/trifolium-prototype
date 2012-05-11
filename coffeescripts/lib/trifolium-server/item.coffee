crypto = require 'crypto'

class Item
    constructor: (@itemId, @name) ->
        date = new Date
        @hash = crypto.createHash('sha1').update("#{@itemId}")
                                       .update("#{@name}")
                                       .update('2c77a50b0c670bb6')
                                       .update("#{date.getTime()}")
                                       .update("#{date.getMilliseconds()}")
                                       .digest('hex')
                                       .substr(0, 12)
    details: ->
       name: @name
       itemId: @itemId
       hash: @hash

class ItemCreator
    constructor: ->
        @itemDict = {}
    setItemDict: (itemDict) ->
        @itemDict = itemDict
    create: (itemId, name = null) ->
        if @itemDict[itemId]?
            new Item itemId, name ? @itemDict[itemId].name
        else
            null

exports.Item = Item
exports.ItemCreator = new ItemCreator
