"use strict";

const Context = require('../context')
const Promise = require('bluebird');
const services = require('./monsterFighterServices');

exports = module.exports = {};

//object that contains the string to output to the user and any step state changes to be done
exports.stepResponse = {
    textOutput: String,
    stepChange: Number
};

//psuedo enum that maps step numbers to descriptive text
exports.steps = {
    COMPLETE: -1,
    WELCOME: 0,
    GAMESELECT: 1,
    NEWUSER: 2,
    BATTLE: 3,
    RESULTS: 4
};

//welcome message
exports.welcome = function(){
    let result = this.stepResponse;
    result.textOutput = "Welcome to Monster Fighter. The commands are as follows, be sure to prefix all commands with !mf:<hr>" +
    "view [name]    - View adventurer info based on their name.<hr>" +
    "battle [name]  - Fight a monster using the named adventurer.<hr>" +
    "new                   - Create a new adventurer.<hr>";
    result.stepChange = this.steps.GAMESELECT;
    return result;
};

//moves user to the desired game function, "view" is done here as it's just a one liner
exports.gameSelect = async function(itemArr){
    let result = this.stepResponse;
    switch (itemArr[0]) {
        case "view":
            result = await this.viewUser(itemArr);
            break;
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

//adds a new adventurer with a unique name
exports.newUser = async function(itemArr){
    let result = this.stepResponse;
    let users = await services.readAdventurerName(itemArr[0]);

    if (users.length === 0){
        await services.addAdventurer(itemArr[0]);
        result.textOutput = "Success! Returning to game select."
    } else {
        result.textOutput = "Error! Adventurer already exists. Returning to game select."
    }

    result.stepChange = this.steps.GAMESELECT;
    return result;
}

//return adventurers that match the inputted name
exports.viewUser = async function(itemArr){
    let result = this.stepResponse
    let dataResponse = await services.readAdventurerName(itemArr[1]);
    result.textOutput = JSON.stringify(dataResponse);
    return result;
}