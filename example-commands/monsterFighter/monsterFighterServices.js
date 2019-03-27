const MongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');

const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'monsterFight';
const client = new MongoClient(url);

client.connect(function (err) {
    assert.equal(null, err);
    db = client.db(dbName);
});

exports = module.exports = {};

exports.adventurerModel = {
    name: String,
    exp: Number,
    level: function () {
        if (!exp) {
            return 0;
        };
        //no formula for this so oh boy
        switch (exp) {
            case exp > 64, 000:
                return 10;
            case exp > 48, 000:
                return 9;
            case exp > 34, 000:
                return 8;
            case exp > 23, 000:
                return 7;
            case exp > 14, 000:
                return 6;
            case exp > 6, 500:
                return 5;
            case exp > 2, 700:
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

exports.readAdventurerName = function (input) {
    return Promise.fromCallback((callback) => db.collection('adventurers').find({ name: input }).toArray(callback))
        .then((docs) => {
            console.log("DB Read:");
            console.log(docs);
            return(docs);
        })
        .catch((err) => {
            console.log(err);
        });

};

exports.addAdventurer = function (advInput) {

    //right now we're only taking the name from this
    let adventurer = this.adventurerModel;
    adventurer.name = advInput;
    adventurer.exp = 0;

    return Promise.fromCallback((callback) => db.collection("adventurers").insertOne(adventurer, callback))
    .then((r) => {
        assert.equal(1, r.insertedCount);
        console.log("DB Write:");
        console.log(r);
        return(r);
    })
    .catch((err) => {
        console.log(err);
    });


};