class ActionInfo
    constructor: (details) ->
        @name = details.name ? 'unknown'
        @time = details.time ? 0
        
        @optionalInfoDict = {}
        @optionalInfoDict[infoName] = info for infoName, info of details when infoName != 'name' && infoName != 'time'
    
exports?.ActionInfo = ActionInfo