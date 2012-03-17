class ActionInfo
    constructor: (details) ->
        @name = details.name ? 'unknown'
        @time = details.time ? 0
        
        @optionalInfo = {}
        @optionalInfo[infoName] = info for infoName, info of details when infoName != 'name' && infoName != 'time'
    
exports?.ActionInfo = ActionInfo