class Simulator
    constructor : (settings) ->
        @spotList = (new Spot(spotInfo.name, spotInfo.posX, spotInfo.posY, spotInfo.actions) for spotInfo in settings.spotList)
        
        @routeList = []
        moveActionList = []
        for routeInfo in settings.routeList
            spot1 = @spotForName routeInfo[0]
            spot2 = @spotForName routeInfo[1]
            moveActionList.push new MoveAction(spot1, spot2)
            moveActionList.push new MoveAction(spot2, spot1)
            @routeList.push [spot1, spot2]
            
        spawnSpot = null
        for spot in @spotList
            spot.actions.push moveAction for moveAction in moveActionList when moveAction.from == spot
            spawnSpot = spot if spot.name == settings.spawnSpot
        
        @braveList = (new Brave(name, spawnSpot, {speed: Math.floor(Math.random() * 50) + 20}) for name in settings.braveNames)
        for brave in @braveList
            action = brave.spot.randomAction()
            action.prepare brave
            brave.action = action
            brave.destination = action.to ? brave.spot
    start: ->
        @count = 0
        timer = setInterval( =>
            @tick()
            @count++
        , 30)
        
    tick: ->
        brave.tick() for brave in @braveList
    
    spotForName: (name) ->
        (spot for spot in @spotList when spot.name == name)[0]