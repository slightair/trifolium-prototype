var mongoose = require('mongoose')
  , EventInfo = require('../lib/trifolium-server/event').EventInfo
  , Floor = require('../lib/trifolium-server/floor').Floor
  , Dungeon = require('../lib/trifolium-server/dungeon').Dungeon
  , trifoliumUtil = require('../lib/util')
  , step = trifoliumUtil.step;

mongoose.connect('mongodb://localhost/trifolium');

exports.up = function(next){
    var saveDungeons = [];
    
    // dungeon A
    var eventA = new EventInfo();
    eventA.type = 'search';
    eventA.treasures = [
          {itemId: 1, probability: 400}
        , {itemId: 2, probability: 100}
    ];
    
    var eventB = new EventInfo();
    eventB.type = 'search';
    eventB.treasures = [
          {itemId: 1, probability: 500}
    ];
    
    var eventC = new EventInfo();
    eventC.type = 'search';
    eventC.treasures = [
          {itemId: 2, probability: 50}
    ];
    
    var dungeonA1F = new Floor();
    dungeonA1F.number = 1;
    dungeonA1F.eventInfos = [
          eventA
        , eventB
    ];
    
    var dungeonA2F = new Floor();
    dungeonA2F.number = 2;
    dungeonA2F.eventInfos = [
        eventC
    ]
    
    dungeonA = new Dungeon();
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
    var dungeonB1F = new Floor();
    dungeonB1F.number = 2;
    dungeonB1F.eventInfos = [
          eventA
        , eventC
    ]
    
    dungeonB = new Dungeon();
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
    Dungeon.remove({}, function(err, dungeons){
        if (err) {
            console.log(err.message);
        }
        
        next();
    });
};
