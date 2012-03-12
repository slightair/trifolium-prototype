crypto = require 'crypto'
itemDict = require('../../settings').itemDict

class Item
    constructor: (@itemId, @name) ->
        date = new Date
        @id = crypto.createHash('sha1').update("#{@itemId}")
                                       .update("#{@name}")
                                       .update('2c77a50b0c670bb6')
                                       .update("#{date.getTime()}")
                                       .update("#{date.getMilliseconds()}")
                                       .digest('hex')
    details: ->
       id: @id
       name: @name
       itemId: @itemId

class ItemCreator
    constructor: (@itemDict) ->
    createItem: (itemId, name = null) ->
        if @itemDict[itemId]?
            new Item itemId, name ? @itemDict[itemId].name
        else
            null

exports.Item = Item
exports.ItemCreator = ItemCreator
exports.SharedItemCreator = new ItemCreator itemDict