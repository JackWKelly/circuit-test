const services = require('./monsterFighterServices');

//This command isn't feature complete yet, but all the systems in it interact as they would do when done

module.exports = {

    name: "Monster Fighter",

    trigger: "!mf",

    payload: async function(item){
        return new convMonsterFighter;
    }

}

class convMonsterFighter{

    constructor(){
        //contains each portion of the input command as an array, updated by the trigger
        //maybe make a psuedo-enum set for positions in the array?
        let itemArr;

        this.trigger = function(item){
            //check if first word in string is the prefix command
            this.itemArr = item.text.content.split(" ");
            return (this.itemArr[0] === "!mf");
        };

        //apparantly enums don't exist so oh boy
        this.states = {
            COMPLETE: -1,
            WELCOME: 0,
            GAMESELECT: 1,
            NEWUSER: 2,
            BATTLE: 3,
            RESULTS: 4
        };
        this.state = this.states.WELCOME
        this.completionState = this.states.COMPLETE;

        this.payload = async function(item){
            let output;
            
            await this.validation(item)
            .then(() => {
                output = this.statechecker(item);
            })      
            .catch(err => {
                output = err;
            });
            return output;
        };

        this.validation = function(item){
            return new Promise((resolve, reject) => {
                switch(this.state){
                    case this.states.GAMESELECT:
                        //check string after the '!mf'
                        switch(this.itemArr[1]){
                            //commands that need a name following them
                            case "view":
                            case "battle":
                                //string following the initial command
                                if(this.itemArr[2]){
                                    resolve();
                                } else {
                                    reject("The inputted command requires a name following it!");
                                }
                                break;
                            //stand alone commands
                            case "new":
                                resolve();
                                break;
                            default:
                                reject("Invalid command.");
                                break;
                        };
                    case this.states.NEWUSER:
                        //requires a name input be present
                        if(this.itemArr[1]){
                            resolve();
                        } else {
                            reject("Your new character needs a name!");
                        }
                    //for message only states, in theory all others should reject when needed
                    default:
                        resolve();
                        break;
                };
            });
        };

        //main logic happens here
        this.statechecker = function(item){
            let output;
            switch(this.state){
                case this.states.WELCOME:
                    output = 
                    "Welcome to Monster Fighter. The commands are as follows, be sure to prefix all commands with !mf:<hr>" +
                    "view [name]    - View adventurer info based on their name.<hr>" +
                    "battle [name]  - Fight a monster using the named adventurer.<hr>" +
                    "new                   - Create a new adventurer.<hr>";
                    this.state = this.states.GAMESELECT;
                    break;
                case this.states.GAMESELECT:
                    switch(this.itemArr[1]){
                        case "view":
                        case "battle":
                            output = "view/battle";
                            break;
                        case "new":
                            output = "New adventurer creation: Send a command with your adventurer's name!";
                            this.state = this.states.NEWUSER;
                            break;
                        default:
                            output = "Invalid command passed validation, time to panic!";
                            break;
                    };
                    break;
                //has it's own state in preperation for additional features further down the line
                case this.states.NEWUSER:
                    //db stuff here
                    output = "new user";
                    break;
                default:
                    output = "You find yourself in a unknown, scary place. How did you get here?";
                    this.state = this.states.COMPLETE;
                    break;
            };
            return output;
        };

    }

}
