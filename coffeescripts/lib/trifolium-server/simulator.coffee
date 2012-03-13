{Brave} = require './brave'
{Spot} = require './spot'
{Action, WaitAction, MoveAction, SearchAction} = require './action'
{SharedItemCreator} = require './item'

class Simulator
    constructor : (config) ->
        {spotInfoList, routeInfoList, spawnSpotName, braveNameDictionary, numBraves, @tickInterval, itemDict} = config
        SharedItemCreator.itemDict = itemDict
        
        @spotList = (new Spot(spotInfo.name, spotInfo.posX, spotInfo.posY, spotInfo.actions) for spotInfo in spotInfoList)
        
        @routeList = []
        moveActionList = []
        for routeInfo in routeInfoList
            spot1 = @spotForName routeInfo[0]
            spot2 = @spotForName routeInfo[1]
            moveActionList.push new MoveAction(spot1, spot2)
            moveActionList.push new MoveAction(spot2, spot1)
            @routeList.push [spot1, spot2]
            
        spawnSpot = @spotForName spawnSpotName
        (spot.actions.push moveAction for moveAction in moveActionList when moveAction.from == spot) for spot in @spotList
        
        (@braveNamePrefixes ?= []).push term for term in dict for dict in [braveNameDictionary.prefixes, braveNameDictionary.terms]
        (@braveNameSuffixes ?= []).push term for term in dict for dict in [braveNameDictionary.suffixes, braveNameDictionary.terms]
        
        @braveList = (new Brave(@makeBraveName(braveNameDictionary), spawnSpot, {speed: Math.floor(Math.random() * 50) + 20}) for i in [0...numBraves])
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
        , @tickInterval)
        
    tick: ->
        brave.tick() for brave in @braveList
    
    makeBraveName: ->
        prefixIndex = parseInt(Math.random() * @braveNamePrefixes.length)
        suffixIndex = parseInt(Math.random() * @braveNameSuffixes.length)
        
        "#{@braveNamePrefixes[prefixIndex]}#{@braveNameSuffixes[suffixIndex]}"
    
    spotForName: (name) ->
        (spot for spot in @spotList when spot.name == name)[0]
    
    braveForName: (name) ->
        (brave for brave in @braveList when brave.name == name)[0]
    
exports.Simulator = Simulator