$ ->
    game = new Game()
    game.start()

class Game
    constructor: ->
        @simulator = new Simulator(settings)
        @canvas = new Canvas($("#main-screen").get(0), 600, 450)
        @mapScale = 2.0
        @appendRoute route for route in @simulator.routeList
        @appendSpot spot for spot in @simulator.spotList
        @appendBrave brave for brave in @simulator.braveList
        @debugMatrix()
    
    appendRoute: (route) ->
        routeColor = 'rgba(0, 255, 0, 0.2)'
        routeObject = new Line(
            @canvas.width / 2 + route[0].posX * @mapScale,
            @canvas.height / 2 + route[0].posY * @mapScale,
            @canvas.width / 2 + route[1].posX * @mapScale,
            @canvas.height / 2 + route[1].posY * @mapScale,
            {stroke: routeColor, strokeWidth: 20, lineCap: 'round'})
        @canvas.append routeObject
    appendSpot: (spot) ->
        spotObject = new Circle(10 * @mapScale, {
                    id: spot.name
                    x: @canvas.width / 2 + spot.posX * @mapScale
                    y: @canvas.height / 2 + spot.posY * @mapScale
                    stroke: 'rgba(0, 0, 255, 1.0)'
                    strokeWidth: 3
                    endAngle: Math.PI * 2
        })
        @canvas.append spotObject
    appendBrave: (brave) ->
        bravePosX = (brave) =>
            @canvas.width / 2 + (brave.spot.posX + (brave.destination.posX - brave.spot.posX) * brave.actionProcess) * @mapScale
        bravePosY = (brave) =>
            @canvas.height / 2 + (brave.spot.posY + (brave.destination.posY - brave.spot.posY) * brave.actionProcess) * @mapScale
        
        braveObject = new Circle(3 * @mapScale, {
                    id: brave.name
                    x: bravePosX brave
                    y: bravePosY brave
                    fill: 'red'
                    endAngle: Math.PI * 2
        })
        braveObject.addFrameListener (t, dt) =>
            braveObject.x = bravePosX brave
            braveObject.y = bravePosY brave
        @canvas.append braveObject
        
    start: ->
        @simulator.start()
    
    debugMatrix: =>
        gridSize = 20
        lineColor = 'rgba(0, 0, 255, 0.1)'
        centerLineColor = 'rgba(0, 0, 255, 0.5)'
        @canvas.append new Line(0, y * gridSize, @canvas.width, y * gridSize, {stroke: lineColor}) for y in [1...(@canvas.height / gridSize)] when y != @canvas.height / 2 / gridSize
        @canvas.append new Line(x * gridSize, 0, x * gridSize, @canvas.height, {stroke: lineColor}) for x in [1...(@canvas.width / gridSize)] when x != @canvas.width / 2 / gridSize
        @canvas.append new Line(0, @canvas.height / 2, @canvas.width, @canvas.height / 2, {stroke: centerLineColor})
        @canvas.append new Line(@canvas.width / 2, 0, @canvas.width / 2, @canvas.height, {stroke: centerLineColor})
