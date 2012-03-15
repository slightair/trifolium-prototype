class ItemInfo
    constructor: (details) ->
        @id     = details.id ? 'unknown'
        @name   = details.name ? 'unknown'
        @itemId = details.itemId ? 0
        
exports?.ItemInfo = ItemInfo
