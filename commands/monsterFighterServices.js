const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'monsterFight';
const client = new MongoClient(url);

client.connect(function(err){
    assert.equal(null, err);
    const db = client.db(dbName);
    //client.close();
});

exports = module.exports = {};

exports.adventurerModel = {
    name: String,
    exp: Number,
    level: function(){
        if(!exp){
            return 0;
        };
        //no formula for this so oh boy
        switch(exp){
            case exp > 64,000:
                return 10;
            case exp > 48,000:
                return 9;
            case exp > 34,000:
                return 8;
            case exp > 23,000:
                return 7;
            case exp > 14,000:
                return 6;
            case exp > 6,500:
                return 5;
            case exp > 2,700:
                return 4;
            case exp > 900:
                return 3;
            case exp > 300:
                return 2;
            default:
                return 1;
        };
    }
};

exports.readAdventurerName = function(name){
    db.collection('adventurers').find
};

exports.addAdventurer = function(advInput){
    //right now we're only taking the name from this
    let adventurer = new adventurerModel;
    adventurer.name = advInput.name;
    adventurer.exp = 0;
    db.collection("adventurers").insertOne(adventurer), function(err, r) {
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);
    }
};
