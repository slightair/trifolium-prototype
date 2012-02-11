settings = {
    "spawnSpot": "castle"
    "spotList": [
        {"name": "townA",    "posX":   20, "posY":  -60, "actions": [
            {"type": "wait", "time": 3000}
        ]}
        {"name": "townB",    "posX": -100, "posY":  -20, "actions": [
            {"type": "wait", "time": 3000}
        ]}
        {"name": "townC",    "posX":   20, "posY":   40, "actions": [
            {"type": "wait", "time": 3000}
        ]}
        {"name": "dungeonA", "posX":  120, "posY":  -80, "actions": [
            {"type": "wait", "time": 3000}
        ]}
        {"name": "dungeonB", "posX":  -60, "posY":  -80, "actions": [
            {"type": "wait", "time": 3000}
        ]}
        {"name": "dungeonC", "posX":  -80, "posY":   60, "actions": [
            {"type": "wait", "time": 3000}
        ]}
        {"name": "castle",   "posX":  -40, "posY":    0, "actions": [
            {"type": "wait", "time": 3000}
        ]}
        {"name": "temple",   "posX":   60, "posY":  -20, "actions": [
            {"type": "wait", "time": 3000}
        ]}
    ]
    "routeList": [
        ["townA", "dungeonB"]
        ["townA", "castle"]
        ["townA", "temple"]
        ["townB", "dungeonB"]
        ["townB", "castle"]
        ["townC", "castle"]
        ["townC", "temple"]
        ["dungeonA", "temple"]
        ["dungeonC", "castle"]
    ]
    "braveNames": [
        'anderson'
        'bob'
        'clarisse'
        'daniel'
        'eric'
        'fredelic'
        'george'
        'heinkel'
        'iris'
        'jennifer'
        'kirby'
        'leonard'
        'michael'
        'nick'
        'orlando'
        'pierre'
        'qian'
        'richard'
        'sara'
        'thomas'
        'ulrich'
        'veeder'
        'walter'
        'xavier'
        'yakov'
        'zach'
    ]
}

exports?.settings = settings