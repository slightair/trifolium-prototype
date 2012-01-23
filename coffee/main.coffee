initialize = ->
    spawnSpot = new Spot("spawn", 0, 0)
    inn = new Spot("inn", 50, 50)
    spawnSpot.actions = [
        new MoveAction(spawnSpot, inn)
    ]
    
    @braveList = (new Brave("no.#{i}", spawnSpot) for i in [0...3])
    for brave in braveList
        do (brave) ->
            action = spawnSpot.randomAction()
            action.prepare(brave)
            brave.action = action
    
main = ->
    initialize()
    
    count = 0
    timer = setInterval( ->
        console.log "#{count++}"
        tick()
        clearInterval(timer) if count > 30
    , 100)

tick = ->
    brave.tick() for brave in @braveList

main()