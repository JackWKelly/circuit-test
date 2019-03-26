const Context = require('./context')
const Promise = require('bluebird');

module.exports = class ConversationCommand extends Context {

    constructor() {
        super();

        //pseudo enums to make steps more obvious, not needed here but nicer on larger conversations
        this.steps = {
            INITIALIZE: 0,
            FIRSTNUMBER: 1,
            OPERATOR: 2,
            SECONDNUMBER: 3,
            DONE: -1
        }
        this.step = this.steps.INITIALIZE;

        this.n1 = null;
        this.op = null;
        this.n2 = null;
    }

    //
    handleMessage(item) {



        //validation checks done here, they could be put into the state logic
        //but I'm thinking in more complex convos that could get out of hand
        //empty returns are a pass, otherwise pass the error to the user
        let validErr = this.validate(item);
        if (validErr){
            return Promise.resolve(validErr);
        }

        //value outputted to the user depending on step state
        var response = null;

        switch(this.step) {
            case this.steps.INITIALIZE: 
                response = "What is the first number in your calculation?";
                this.step = this.steps.FIRSTNUMBER;
                break;
            case this.steps.FIRSTNUMBER:
                response = "What operation does your caclulation do?";
                this.n1 = parseFloat(item);
                this.step = this.steps.OPERATOR;
                break;
            case this.steps.OPERATOR:
                response = "What is the second number in your calculation?";
                this.op = item;
                this.step = this.steps.SECONDNUMBER;
                break;
            case this.steps.SECONDNUMBER:
                this.n2 = parseFloat(item);
                let answer = this.calculate();
                response = "Your answer is: " + answer;
                this.step = this.steps.DONE;
                break;
            default:
                response = "How did you get here?";
                this.step = this.steps.DONE;
                break;
        }

        // Return the response
        return Promise.resolve(response);
    }

    //pet step input validation, empty returns are a pass
    //returned strings are outputted to the user
    //not sure if the redundant 'breaks' should be kept
    validate(item){
        switch(this.step){
            case this.steps.FIRSTNUMBER:
            case this.steps.SECONDNUMBER:
                if(isNaN(item)){
                    return("Your input is not a number!");
                }
                else{
                    return;
                };
                break;
            case this.steps.OPERATOR:
                switch(item){
                    case '+':
                    case '-':
                    case '*':
                    case '/':
                        return;
                        break;
                    default:
                        return("Invalid operator!");
                };
                break;
            default:
                return;
                break;
        }
    }

    //quick calculation function, called at the end of the conversation
    calculate() {
        let answer;
            switch(this.op){
                case '*':
                    answer = this.n1 * this.n2;
                    break;
                case '/':
                    answer = this.n1 / this.n2;
                    break;
                case '+':
                    answer = this.n1 + this.n2;
                    break;
                case '-':
                    answer = this.n1 - this.n2;
                    break;
            };
        return answer;
    }

    isConversationEnded() {
        return this.step === this.steps.DONE;
    }
}