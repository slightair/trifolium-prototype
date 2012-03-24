exports.index = (req, res) ->
    settings = req.app.settings
    notifierMode = settings.notifierConfig.mode
    websocketConfig = ""
    websocketModule = ""
    if notifierMode == 'pusher'
        websocketModule = 'javascripts/lib/pusher.min.js'
        websocketConfigValue = "{mode:'pusher',pusherTokenKey:'#{settings.pusherTokenKey}'}"
    else if notifierMode == 'socket.io'
        websocketModule = "#{settings.gameServerHost}/socket.io/socket.io.js"
        websocketConfig = "{mode:'socket.io',host:'#{settings.gameServerHost}'}"
    
    res.render "index",
        title: "World"
        scriptfiles: [
            'javascripts/lib/bootstrap-tab.js'
            'javascripts/lib/cake.js'
            'javascripts/game.min.js'
            websocketModule
        ]
        params:
            Name: 'brave-name'
            Location: 'brave-location'
            Lv: 'brave-lv'
            Attack: 'brave-atk'
            MagicAttack: 'brave-matk'
            HP: 'brave-hp'
            MP: 'brave-mp'
            Brave: 'brave-brave'
            Faith: 'brave-faith'
            Speed: 'brave-speed'
            Action: 'brave-action'
        script: "var gameConfig={width:580,height:450,trifolium:{websocket:#{websocketConfig}},gameServerHost:'#{settings.gameServerHost}'};"
