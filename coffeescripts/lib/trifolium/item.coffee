class Item
    constructor: (@itemId, @name) ->
        date = new Date
        @id = "#{date.getTime()}#{date.getMilliseconds()}" # tentative
    
class ItemCreator
    constructor: (@itemDict) ->
    createItem: (itemId, name = null) ->
        if @itemDict[itemId]?
            new Item itemId, name ? @itemDict[itemId].name
        else
            null

exports?.Item = Item
exports?.ItemCreator = ItemCreator