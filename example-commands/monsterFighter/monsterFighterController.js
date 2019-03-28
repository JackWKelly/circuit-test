"use strict";

const Context = require('../context')
const Promise = require('bluebird');
const services = require('./monsterFighterServices');

exports = module.exports = {};

exports.stepResponse = {
    textOutput: String,
    stepChange: Number
};

exports.steps = {
    COMPLETE: -1,
    WELCOME: 0,
    GAMESELECT: 1,
    NEWUSER: 2,
    BATTLE: 3,
    RESULTS: 4
};

exports.welcome = function(){
    let result = this.stepResponse;
    result.textOutput = "Welcome to Monster Fighter. The commands are as follows, be sure to prefix all commands with !mf:<hr>" +
    "view [name]    - View adventurer info based on their name.<hr>" +
    "battle [name]  - Fight a monster using the named adventurer.<hr>" +
    "new                   - Create a new adventurer.<hr>";
    result.stepChange = this.steps.GAMESELECT;
    return result;
};

exports.gameSelect = function(itemArr){
    let result = this.stepResponse;
    switch (itemArr[0]) {
        case "view":
        case "battle":
            result.textOutput = "view/battle";
            break;
        case "new":
            result.textOutput = "New adventurer creation: Send a command with your adventurer's name!";
            result.stepChange = this.steps.NEWUSER;
            break;
        default:
            result.textOutput = "Invalid command passed validation, time to panic!";
            break;
    };
    return result;
};

exports.newUser = async function(itemArr){
    let result = this.stepResponse
    await services.addAdventurer(itemArr[0]);
    result.textOutput = await services.readAdventurerName(itemArr[0]);
    return result;
}