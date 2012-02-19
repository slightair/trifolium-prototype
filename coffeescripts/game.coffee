$ ->
    game = new Game()
    game.start()

class Game
    constructor: ->
        @simulator = new Trifolium(settings)
        @canvas = new Canvas($("#main-screen").get(0), 600, 450)
        @mapScale = 2.0
        @selectedBrave = null
    
    appendRoute: (route) ->
        routeColor = 'rgba(0, 255, 0, 0.2)'
        routeObject = new Line(
            @canvas.width / 2 + route[0].posX * @mapScale,
            @canvas.height / 2 + route[0].posY * @mapScale,
            @canvas.width / 2 + route[1].posX * @mapScale,
            @canvas.height / 2 + route[1].posY * @mapScale,
            {stroke: routeColor, strokeWidth: 10 * @mapScale, lineCap: 'round'})
        @canvas.append routeObject
    appendSpot: (spot) ->
        spotObject = new Circle(10 * @mapScale, {
                    id: spot.name
                    x: @canvas.width / 2 + spot.posX * @mapScale
                    y: @canvas.height / 2 + spot.posY * @mapScale
                    stroke: 'rgba(0, 0, 255, 1.0)'
                    strokeWidth: @mapScale
                    endAngle: Math.PI * 2
        })
        @canvas.append spotObject
    appendBrave: (brave) ->
        braveObject = new CanvasNode(3 * @mapScale, {
                    id: brave.name
                    x: @bravePosX brave
                    y: @bravePosY brave
        })
        braveObject.addFrameListener (t, dt) =>
            braveObject.x = @bravePosX brave
            braveObject.y = @bravePosY brave
        braveObject.addEventListener('mousedown', (event) =>
            @selectedBrave = brave
        )
        
        color = "hsla(#{parseInt(Math.random() * 360)}, 70%, 50%, 1.0)"
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
        
        @canvas.append braveObject
    
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
        $("#brave-position-value").text("#{brave.spot.name}")
        $("#brave-action-value").text("#{brave.action.name}")
        
        actionProcessPercentage = (brave.actionProcess * 100).toFixed(1)
        $("#brave-actionProcess-bar").text("#{actionProcessPercentage}%")
        $("#brave-actionProcess-bar").css("width", "#{actionProcessPercentage}%")
    
    bravePosX: (brave) ->
        @canvas.width / 2 + (brave.spot.posX + (brave.destination.posX - brave.spot.posX) * brave.actionProcess) * @mapScale
    
    bravePosY: (brave) ->
        @canvas.height / 2 + (brave.spot.posY + (brave.destination.posY - brave.spot.posY) * brave.actionProcess) * @mapScale
    
    prepareDisplayObjects: ->
        @appendRoute route for route in @simulator.routeList
        @appendSpot spot for spot in @simulator.spotList
        @appendBrave brave for brave in @simulator.braveList
        @debugMatrix()
        
        markerSize = 16 * @mapScale
        selectedBraveMarker = new Rectangle markerSize, markerSize,
            rx: 4
            ry: 4
            x: -markerSize
            y: -markerSize
            fill: "rgba(255, 128, 0, 0.3)"
            stroke: "rgba(255, 128, 0, 0.5)"
            strokeWidth: @mapScale
            endAngle: Math.PI * 2
        selectedBraveMarker.addFrameListener (t, dt) =>
            if @selectedBrave
                selectedBraveMarker.x = @bravePosX(@selectedBrave) - markerSize / 2
                selectedBraveMarker.y = @bravePosY(@selectedBrave) - markerSize / 2
        @canvas.append selectedBraveMarker
        
        @canvas.addFrameListener (t, dt) =>
            @displayBraveInfo @selectedBrave if @selectedBrave
    
    start: ->
        @prepareDisplayObjects()
        @simulator.start()
    
    debugMatrix: =>
        gridSize = 10 * @mapScale
        lineColor = 'rgba(0, 0, 255, 0.1)'
        centerLineColor = 'rgba(0, 0, 255, 0.5)'
        gapX = @canvas.width % gridSize / 2
        gapY = @canvas.height % gridSize / 2
        
        @canvas.append new Line(0, y * gridSize + gapY, @canvas.width, y * gridSize + gapY, {stroke: lineColor}) for y in [0...(@canvas.height / gridSize)] when y != @canvas.height / 2 / gridSize
        @canvas.append new Line(x * gridSize + gapX, 0, x * gridSize + gapX, @canvas.height, {stroke: lineColor}) for x in [0...(@canvas.width / gridSize)] when x != @canvas.width / 2 / gridSize
        @canvas.append new Line(0, @canvas.height / 2, @canvas.width, @canvas.height / 2, {stroke: centerLineColor})
        @canvas.append new Line(@canvas.width / 2, 0, @canvas.width / 2, @canvas.height, {stroke: centerLineColor})
