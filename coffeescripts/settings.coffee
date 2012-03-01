settings = {
    "tickInterval": 30
    "spawnSpotName": "ちくわ城"
    "spotInfoList": [
        {"name": "こんぶシティー",    "posX":   20, "posY":  -60, "actions": [
            {"type": "wait", "time": 3000}
        ]}
        {"name": "もずくタウン",    "posX": -100, "posY":  -20, "actions": [
            {"type": "wait", "time": 3000}
        ]}
        {"name": "わかめビレッジ",    "posX":   20, "posY":   40, "actions": [
            {"type": "wait", "time": 3000}
        ]}
        {"name": "なめこの洞窟", "posX":  120, "posY":  -80, "actions": [
            {"type": "wait", "time": 3000}
            {
                "type": "search"
                "time": 5000
                "treasures": [
                    {
                        "itemId": 1
                        "probability": 500
                    }
                    {
                        "itemId": 2
                        "probability": 100
                    }
                ]
            }
        ]}
        {"name": "たけのこ山", "posX":  -60, "posY":  -80, "actions": [
            {"type": "wait", "time": 3000}
        ]}
        {"name": "かまぼこの迷宮", "posX":  -80, "posY":   60, "actions": [
            {"type": "wait", "time": 3000}
        ]}
        {"name": "ちくわ城",   "posX":  -40, "posY":    0, "actions": [
            {"type": "wait", "time": 3000}
        ]}
        {"name": "たまねぎ寺院",   "posX":   60, "posY":  -20, "actions": [
            {"type": "wait", "time": 3000}
        ]}
    ]
    "routeInfoList": [
        ["こんぶシティー", "たけのこ山"]
        ["こんぶシティー", "ちくわ城"]
        ["こんぶシティー", "たまねぎ寺院"]
        ["もずくタウン", "たけのこ山"]
        ["もずくタウン", "ちくわ城"]
        ["わかめビレッジ", "ちくわ城"]
        ["わかめビレッジ", "たまねぎ寺院"]
        ["なめこの洞窟", "たまねぎ寺院"]
        ["かまぼこの迷宮", "ちくわ城"]
    ]
    "numBraves": 12
    "braveNameDictionary":
        "terms": [
            "ポチ"
            "タマ"
            "ヒロ"
            "チン"
            "ペロ"
            "ヒコ"
            "テル"
            "ユキ"
            "トロ"
            "リン"
            "ポコ"
            "タラ"
            "ナリ"
            "イチ"
            "ユウ"
            "ヨシ"
            "オリ"
            "タケ"
            "マサ"
            "タカ"
            "ナオ"
            "スケ"
            "ピヨ"
            "フウ"
            "ツネ"
            "ノロ"
            "ポロ"
            "ポポ"
            "トト"
            "テロ"
            "ピロ"
            "ポン"
            "ポワ"
            "ヨネ"
            "ウメ"
            "ノリ"
            "ロウ"
            "ゾウ"
            "ヤン"
            "ハン"
            "リィ"
            "オウ"
            "チィ"
            "ケン"
            "チヨ"
            "リリ"
            "ザム"
            "ラム"
            "ヒム"
            "タキ"
            "ザワ"
        ]
        "prefixes": [
        ]
        "suffixes": [
            "ミ"
            "カ"
            "コ"
            "リ"
            "ヨ"
            "エ"
            "ノ"
            "ッピ"
            "ッチ"
            "ッペ"
            "ヲ"
            "オ"
            "シ"
            "ス"
            "ッス"
            "ッツ"
            "ト"
            "ジ"
            "ザ"
            "ラ"
        ]
}

itemDict = {
    1:
        name: 'きのこ'
    2:
        name: 'いいきのこ'
    3:
        name: 'ちくわ'
    4:
        name: 'いいちくわ'
    5:
        name: 'おにく'
    6:
        name: 'いいおにく'
    10:
        name: '竹の槍'
}

exports?.settings = settings
exports?.itemDict = itemDict