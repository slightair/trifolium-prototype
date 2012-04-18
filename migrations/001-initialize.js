var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/trifolium');

var dungeon = require('../lib/trifolium-server/dungeon')
  , FloorModel = dungeon.FloorModel
  , DungeonModel = dungeon.DungeonModel
  , trifoliumUtil = require('../lib/util')
  , step = trifoliumUtil.step;

exports.up = function(next){
    var floor1 = new FloorModel();
    floor1.type = 'search';
    floor1.treasures = [
        {itemId: 1, probability: 400}
        , {itemId: 2, probability: 100}
    ];
    
    dungeon = new DungeonModel();
    dungeon.name = 'testDungeon';
    dungeon.floors = [
        floor1
    ];
    dungeon.save(function(err){
        if (err) {
            console.log(err.message);
        }
        
        next();
    });
};

exports.down = function(next){
    DungeonModel.remove({}, function(err, dungeons){
        if (err) {
            console.log(err.message);
        }
        
        next();
    });
};
