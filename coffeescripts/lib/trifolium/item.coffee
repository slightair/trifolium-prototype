class Item
    constructor: (@name = 'unknown')->
        date = new Date
        @id = "#{date.getTime()}#{date.getMilliseconds()}" # tentative

exports?.Item = Item