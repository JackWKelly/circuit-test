const Context = require('../context')
const Promise = require('bluebird');
const services = require('./monsterFighterServices');

module.exports = class ConversationCommand extends Context {

    constructor() {
        super();

        //pseudo enums to make steps more obvious, not needed here but nicer on larger conversations
        this.steps = {
            COMPLETE: -1,
            WELCOME: 0,
            GAMESELECT: 1,
            NEWUSER: 2,
            BATTLE: 3,
            RESULTS: 4
        };
        this.step = this.steps.WELCOME;

        this.itemArr = null;


    }

    //validates input based on step state
    //inputs data to calculation variables
    //outputs calculation answer
    async handleMessage(item) {

        //split message into each word for validation and later parsing
        this.itemArr = item.split(" ");

        //validation checks done here, they could be put into the state logic
        //but I'm thinking in more complex convos that could get out of hand
        //empty returns are a pass, otherwise pass the error to the user
        let validErr = this.validate(item);
        if (validErr) {
            return (validErr);
        }

        //value outputted to the user depending on step state
        var response = null;

        //does this switch statement need documentation or is it self explanatory enough?
        switch (this.step) {
            case this.steps.WELCOME:
                response =
                    "Welcome to Monster Fighter. The commands are as follows, be sure to prefix all commands with !mf:<hr>" +
                    "view [name]    - View adventurer info based on their name.<hr>" +
                    "battle [name]  - Fight a monster using the named adventurer.<hr>" +
                    "new                   - Create a new adventurer.<hr>";
                this.step = this.steps.GAMESELECT;
                break;
            case this.steps.GAMESELECT:
                switch (this.itemArr[0]) {
                    case "view":
                    case "battle":
                        response = "view/battle";
                        break;
                    case "new":
                        response = "New adventurer creation: Send a command with your adventurer's name!";
                        this.step = this.steps.NEWUSER;
                        break;
                    default:
                        response = "Invalid command passed validation, time to panic!";
                        break;
                };
                break;
            case this.steps.NEWUSER:
                await services.addAdventurer(this.itemArr[0]);
                response = await services.readAdventurerName(this.itemArr[0]);
                break;
            default:
                response = "You find yourself in a unknown, scary place. How did you get here? Step: " + this.step;
                this.step = this.steps.COMPLETE;
                break;
        };

        // Return the response
        return (response);
    }

    //per step input validation, empty returns are a pass
    //returned strings are outputted to the user
    //not sure if the redundant 'breaks' should be kept
    validate() {
        switch (this.step) {
            case this.steps.GAMESELECT:
                //check string after the '!mf'
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