var Database = require('../lib/database')
  , EventModel = Database.EventModel
  , FloorModel = Database.FloorModel
  , DungeonModel = Database.DungeonModel
  , trifoliumUtil = require('../lib/util')
  , step = trifoliumUtil.step;

exports.up = function(next){
    var saveDungeons = [];
    
    // dungeon A
    var eventA = new EventModel();
    eventA.type = 'search';
    eventA.treasures = [
          {itemId: 1, probability: 400}
        , {itemId: 2, probability: 100}
    ];
    
    var eventB = new EventModel();
    eventB.type = 'search';
    eventB.treasures = [
          {itemId: 1, probability: 500}
    ];
    
    var eventC = new EventModel();
    eventC.type = 'search';
    eventC.treasures = [
          {itemId: 2, probability: 50}
    ];
    
    var dungeonA1F = new FloorModel();
    dungeonA1F.number = 1;
    dungeonA1F.events = [
          eventA
        , eventB
    ];
    
    var dungeonA2F = new FloorModel();
    dungeonA2F.number = 2;
    dungeonA2F.events = [
        eventC
    ]
    
    dungeonA = new DungeonModel();
    dungeonA.name = 'dungeon A';
    dungeonA.floors = [
          dungeonA1F
        , dungeonA2F
    ];
    
    saveDungeons.push(function(done){
        dungeonA.save(function(err){
            if (err)console.log(err.message);
            done();
        });
    });
    
    // dungeon B
    var dungeonB1F = new FloorModel();
    dungeonB1F.number = 2;
    dungeonB1F.events = [
          eventA
        , eventC
    ]
    
    dungeonB = new DungeonModel();
    dungeonB.name = 'dungeon B';
    dungeonB.floors = [
        dungeonB1F
    ];
    
    saveDungeons.push(function(done){
        dungeonB.save(function(err){
            if (err)console.log(err.message);
            done();
        });
    });
    
    step(saveDungeons, next);
};

exports.down = function(next){
    DungeonModel.remove({}, function(err, dungeons){
        if (err) {
            console.log(err.message);
        }
        
        next();
    });
};
