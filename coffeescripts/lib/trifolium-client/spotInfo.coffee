class SpotInfo
    constructor: (details) ->
        @id   = details.id ? 'unknown'
        @name = details.name ? 'unknown'
        @posX = details.posX ? 0
        @posY = details.posY ? 0
    
exports?.SpotInfo = SpotInfo
