exports.index = (req, res) ->
    res.render "index",
        title: "Express"
        params:
            Name: ''
            Lv: ''
            Attack: ''
            MagicAttack: ''
            HP: ''
            MP: ''
            Brave: ''
            Faith: ''
            Speed: ''
            Action: ''
            ActionProcess: ''
