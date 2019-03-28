"use strict";

const Context = require('../context')
const Promise = require('bluebird');
const services = require('./monsterFighterServices');
const controller = require('./monsterFighterController');

/*
Monster Fighter is a game wherein you engage in short
rng based battles with random monster in a turn based fashion.

Systems in play are:

The adventurer (stored via mongoDB) which has a name and
exp count, with a helper function to decide level.

The monster, grabbed on battle start from a DnD 5e API
based on the adventurer's level to match with an appropriate
monster challenge rating.
*/
module.exports = class ConversationCommand extends Context {

    constructor() {
        super();

        /*
        Psuedo enum that maps step numbers to descriptive text.
        Defined in the controller so it doesn't need to be duplicated
        here opening an avenue for a mismatch between files.

        For reference the steps are:
        COMPLETE: -1,
        WELCOME: 0,
        GAMESELECT: 1,
        NEWUSER: 2,
        BATTLE: 3,
        RESULTS: 4
        */
        this.steps = controller.steps;
        //current step the system is on
        this.step = this.steps.WELCOME;

        //stores the input string split into an array with each element being a single word
        //TODO: perhaps should be a scoped variable of handleMessage() which is passed to helpers
        this.itemArr = null;


    }

    //sends input to be validated
    //invokes relevant monsterFighterController function based on step state
    //controller returns an object containing any step state updates and a message output
    //step is changed if need be and output is returned to the cmdController
    async handleMessage(item) {

        //split message into each word for validation and later parsing
        this.itemArr = item.split(" ");

        //validation checks done here
        //empty returns are a pass, otherwise pass the error to the user
        let validErr = this.validate(item);
        if (validErr) {
            return (validErr);
        };

        //object that contains the string to output to the user and any step state changes to be done
        let controllerOutput = controller.stepResponse;

        //main step state logic
        switch (this.step) {
            case this.steps.WELCOME:
                controllerOutput = controller.welcome();
                break;
            case this.steps.GAMESELECT:
                controllerOutput = await controller.gameSelect(this.itemArr);
                break;
            case this.steps.NEWUSER:
                controllerOutput = await controller.newUser(this.itemArr)
                break;
            //if an error brings in an invalid step output it and end the conversation
            default:
                response = "You find yourself in a unknown, scary place. How did you get here? Current Step: " + this.step;
                this.step = this.steps.COMPLETE;
                break;
        };

        //set the step from the controller output
        if (controllerOutput.stepChange){
            this.step = controllerOutput.stepChange;
        };

        // Return the response
        return (controllerOutput.textOutput);
    }

    //per step input validation, empty returns are a pass
    //returned strings are outputted to the user
    validate() {
        switch (this.step) {
            case this.steps.GAMESELECT:
                //check the first word
                switch (this.itemArr[0]) {
                    //commands that need a name following them
                    case "view":
                    case "battle":
                        //string following the initial command
                        if (this.itemArr[1]) {
                            return;
                        } else {
                            return ("The inputted command requires a name following it!");
                        }
                    //stand alone commands
                    case "new":
                        return;
                    default:
                        return ("Invalid command.");
                };
            case this.steps.NEWUSER:
                //requires a name input be present
                //(not really needed with the new setup since you have to have SOMETHING written to post)
                if (this.itemArr[0]) {
                    return;
                } else {
                    return ("Your new character needs a name!");
                }
            //for message only states, in theory all others should reject when needed
            default:
                return;
        };
    };

    isConversationEnded() {
        return this.step === this.steps.COMPLETE;
    }
}