initialize = ->
    spawnSpot = new Spot("spawn", 0, 0)
    inn = new Spot("inn", 50, 50)
    dungeon = new Spot("dungeon", 100, 50)
    
    spawn2inn = new MoveAction(spawnSpot, inn)
    inn2dungeon = new MoveAction(inn, dungeon)
    dungeon2inn = new MoveAction(dungeon, inn)
    
    spawnSpot.actions = [
        spawn2inn
    ]
    
    inn.actions = [
        inn2dungeon
    ]
    
    dungeon.actions = [
        dungeon2inn
    ]
    
    names = ['armstrong', 'bob', 'clarisse']
    @braveList = (new Brave(names[i], spawnSpot) for i in [0...3])
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
        clearInterval(timer) if count > 100
    , 30)

tick = ->
    brave.tick() for brave in @braveList

main()