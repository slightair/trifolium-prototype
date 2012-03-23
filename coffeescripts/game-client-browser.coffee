$ ->
    game = new Game(580, 450)

class Game
    constructor: (@width, @height)->
        @trifolium = new Trifolium trifoliumConfig
        @canvas = new Canvas $("#main-screen").get(0), @width, @height
        @infoLayer = new CanvasNode
        @braveLayer = new CanvasNode
        @mapLayer = new CanvasNode
        @mapScale = 2.0
        @selectedBrave = null
        @braveObjects = []
        @logMax = 6
        
        @trifolium.on 'restoreGameStatus', =>
            @prepareDisplayObjects()
        @trifolium.on 'braveCompleteAction', (brave, action, result) =>
            @braveCompleteAction(brave, action, result)
    
    appendRoute: (route) ->
        routeColor = '#a8ff60'
        routeObject = new Line(
            @width / 2 + route[0].posX * @mapScale,
            @height / 2 + route[0].posY * @mapScale,
            @width / 2 + route[1].posX * @mapScale,
            @height / 2 + route[1].posY * @mapScale,
            {stroke: routeColor, strokeWidth: 10 * @mapScale, lineCap: 'round'})
        @mapLayer.append routeObject
    
    appendSpot: (spot) ->
        spotObject = new Circle(10 * @mapScale, {
                    id: spot.id
                    x: @width / 2 + spot.posX * @mapScale
                    y: @height / 2 + spot.posY * @mapScale
                    stroke: '#0000ff'
                    strokeWidth: @mapScale
                    endAngle: Math.PI * 2
        })
        @mapLayer.append spotObject
    
    appendBrave: (brave) ->
        braveObject = new CanvasNode
                    id: brave.id
                    x: @bravePosX brave
                    y: @bravePosY brave
                    addedActionEffect: false
        braveObject.addFrameListener (t, dt) =>
            braveObject.x = @bravePosX brave
            braveObject.y = @bravePosY brave
            gameTimeInterval = dt / @trifolium.tickInterval
            brave.updateActionProcess gameTimeInterval
            
            if brave == @selectedBrave
                actionProcessPercentage = (brave.actionProcess * 100).toFixed(1)
                $("#brave-actionProcess-bar").text("#{actionProcessPercentage}%")
                $("#brave-actionProcess-bar").css("width", "#{actionProcessPercentage}%")
        braveObject.addEventListener('mousedown', (event) =>
            @selectedBrave = brave
            @displayBraveInfo brave
        )
        
        color = "hsl(#{parseInt(Math.random() * 360)}, 70%, 50%)"
        head = new Circle 2 * @mapScale,
                    x: 0
                    y: -2 * @mapScale
                    fill: color
                    endAngle: Math.PI * 2
        body = new Rectangle 4 * @mapScale, 4 * @mapScale,
                    x: -2 * @mapScale
                    y: 0
                    fill: color
        
        braveObject.append head
        braveObject.append body
        
        @braveLayer.append braveObject
        @braveObjects.push braveObject
    
    braveCompleteAction: (brave, action, result) ->
        braveObject = @braveObjectForId brave.id
        braveObject.append @actionEffect()
        
        if brave == @selectedBrave
            $("#brave-location-value").text("#{brave.spot.name}")
            $("#brave-action-value").text("#{brave.action.name}")
            if action.name == 'search' && result.isSucceed && result.treasure
                $("#brave-item-table tbody").append($("<tr><td></td><td>#{result.treasure.name}</td></tr>"))
            
        switch action.name
            when 'move'
                arrivalSpot = @trifolium.spotForId action.optionalInfo.to
                @log "勇者#{@logBraveName(brave.name)} が #{@logSpotName(arrivalSpot.name)} に到着しました"
            when 'wait'
                @log "勇者#{@logBraveName(brave.name)} はぼーっとしていた"
            when 'search'
                if result.isSucceed
                    @log "勇者#{@logBraveName(brave.name)} は #{@logItemName(result.treasure.name)} を手に入れた!"
                else
                    if result.treasure
                        @log "勇者#{@logBraveName(brave.name)} は #{@logItemName(result.treasure.name)} を見つけたが、これ以上アイテムを持てないのであきらめた…"
                    else
                        @log "勇者#{@logBraveName(brave.name)} はアイテムを見つけられなかった…"
            else
                @log "unknown event - #{action.name}"
    
    actionEffect: ->
        maxScale = 20.0
        effectTime = 800
        
        effect = new Circle 1 * @mapScale,
            x: 0
            y: 0
            fill: '#ffffb6'
            endAngle: Math.PI * 2
            opacity: 1.0
        
        effect.addFrameListener (t, dt) ->
            @startTime ?= t
            process = (t - @startTime) / effectTime
            @scale = maxScale * process
            @opacity = 1 - process
        
        effect.after effectTime, ->
            @removeSelf()
        
        effect
        
    displayBraveInfo: (brave) ->
        paramNames = [
            'name'
            'lv'
            'atk'
            'matk'
            'hp'
            'mp'
            'brave'
            'faith'
            'speed'
        ]
        $("#brave-#{paramName}-value").text(brave[paramName]) for paramName in paramNames
        $("#brave-location-value").text("#{brave.spot.name}")
        $("#brave-action-value").text("#{brave.action.name}")
        $("#brave-item-table tbody").empty()
        $("#brave-item-table tbody").append($("<tr><td></td><td>#{item.name}</td></tr>")) for item in brave.items
    
    bravePosX: (brave) ->
        @width / 2 + (brave.spot.posX + (brave.destination.posX - brave.spot.posX) * brave.actionProcess) * @mapScale
    
    bravePosY: (brave) ->
        @height / 2 + (brave.spot.posY + (brave.destination.posY - brave.spot.posY) * brave.actionProcess) * @mapScale
    
    braveObjectForId: (id) ->
        (braveObject for braveObject in @braveObjects when braveObject.id == id)[0]
    
    prepareDisplayObjects: ->
        @appendRoute route for route in @trifolium.routeList
        @appendSpot spot for spot in @trifolium.spotList
        @appendBrave brave for brave in @trifolium.braveList
        
        markerSize = 16 * @mapScale
        selectedBraveMarker = new Rectangle markerSize, markerSize,
            rx: 4
            ry: 4
            x: -markerSize
            y: -markerSize
            stroke: '#ff6c60'
            strokeWidth: @mapScale
            endAngle: Math.PI * 2
        selectedBraveMarker.addFrameListener (t, dt) =>
            if @selectedBrave
                selectedBraveMarker.x = @bravePosX(@selectedBrave) - markerSize / 2
                selectedBraveMarker.y = @bravePosY(@selectedBrave) - markerSize / 2
        
        @infoLayer.append new ElementNode E('div', id: 'log'),
            valign: "bottom"
            y: @height
        
        @canvas.append @mapLayer, selectedBraveMarker, @braveLayer, @infoLayer
    
    log: (text) ->
        if @logMax <= $("div#log").children().length
            $("div#log").children(":first").remove()
        
        $("div#log").append($("<div class='logItem'>#{text}</div>"))
    
    logBraveName: (name) -> "<span class='log-brave-name'>#{name}</span>"
    logSpotName: (name) -> "<span class='log-spot-name'>#{name}</span>"
    logItemName: (name) -> "<span class='log-item-name'>#{name}</span>"
