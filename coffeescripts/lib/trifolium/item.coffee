if require?
    itemDict = require('../../settings').itemDict

class Item
    constructor: (@itemId, @name) ->
        date = new Date
        @id = "#{date.getTime()}#{date.getMilliseconds()}#{@itemId}#{@name}" # tentative
    
class ItemCreator
    constructor: (@itemDict) ->
    createItem: (itemId, name = null) ->
        if @itemDict[itemId]?
            new Item itemId, name ? @itemDict[itemId].name
        else
            null

SharedItemCreator = new ItemCreator itemDict

exports?.Item = Item
exports?.ItemCreator = ItemCreator
exports?.SharedItemCreator = SharedItemCreator