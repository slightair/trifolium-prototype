var mongoose = require('mongoose')
  , Dungeon = require('../lib/trifolium-server/dungeon').Dungeon
  , DungeonCreator = require('../lib/trifolium-server/dungeon').DungeonCreator;

mongoose.connect('mongodb://localhost/trifolium');

exports.up = function(next){
    DungeonCreator.createDungeons([
        {
            name: 'なめこの洞窟'
          , floors: [
                {
                    number: 1
                  , events: [
                        {
                            type: 'search'
                          , treasures: [
                                {itemId: 1, probability: 400}
                              , {itemId: 2, probability: 100}
                            ]
                        }
                      , {
                            type: 'search'
                          , treasures: [
                                {itemId: 1, probability: 500}
                            ]
                        }
                    ]
                }
              , {
                    number: 2
                  , events: [
                        {
                            type: 'search'
                          , treasures: [
                                {itemId: 2, probability: 50}
                            ]
                        }
                    ]
                }
            ]
        }
      , {
            name: 'ちくわの山'
          , floors: [
                {
                    number: 1
                  , events: [
                        {
                            type: 'search'
                          , treasures: [
                                {itemId: 1, probability: 500}
                            ]
                        }
                    ]
                }
              , {
                    number: 2
                  , events: [
                        {
                            type: 'search'
                          , treasures: [
                                {itemId: 3, probability: 50}
                            ]
                        }
                    ]
                }
            ]
        }
    ], function(dungeons){
        next();
    });
};

exports.down = function(next){
    Dungeon.remove({}, function(err, dungeons){
        if (err) {
            console.log(err.message);
        }
        
        next();
    });
};
