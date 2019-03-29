"use strict";
const MongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');

const assert = require('assert');

//'db' needs to be accessable on it's own to access database functions
const url = 'mongodb://localhost:27017';
const dbName = 'monsterFight';
const client = new MongoClient(url);
let db = null;
client.connect(function (err) {
    assert.equal(null, err);
    db = client.db(dbName);
});

exports = module.exports = {};

exports.adventurerModel = {
    name: String,
    exp: Number,

    //calculates level from exp
    //not sure if functions should be embedded in objects like this
    level: function () {
        if (!this.exp) {
            return 0;
        };
        //this can't work decently in a switch statement so time for 'if else' hell
        if (this.exp > 64000) { return 10; }
        else if (this.exp > 48000) { return 9; }
        else if (this.exp > 34000) { return 8; }
        else if (this.exp > 23000) { return 7; }
        else if (this.exp > 14000) { return 6; }
        else if (this.exp > 6500) { return 5; }
        else if (this.exp > 2700) { return 4; }
        else if (this.exp > 900) { return 3; }
        else if (this.exp > 300) { return 2; }
        else { return 1 };
    }
};

exports.readAdventurerName = function (input) {
    return Promise.fromCallback((callback) => db.collection('adventurers').find({ name: input }).toArray(callback))
        .then((docs) => {
            console.log("DB Read:");
            console.log(docs);
            return (docs);
        })
        .catch((err) => {
            console.log(err);
        });

};

//initializes a new adventurer in the database at 0 exp
//if expanded there will be additional features for this
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
            return (r);
        })
        .catch((err) => {
            console.log(err);
        });


};