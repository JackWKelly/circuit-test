
module.exports = {

    name: "Calculator",

    trigger: "!ccalc",

    payload: async function(item){
        return new convTest;
    }

}

class convTest{

    constructor(){
        this.trigger = function(item){
            return true;
        };

        this.n1;
        this.n2;
        this.op;

        this.state = 0;
        this.completionState = 4;
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
                    case 1:
                    case 3:
                        if(isNaN(item.text.content)){
                            reject("Your input is not a number!");
                        }
                        else{
                            resolve();
                        };
                        break;
                    case 2:
                        switch(item.text.content){
                            case '+':
                            case '-':
                            case '*':
                            case '/':
                                resolve();
                                break;
                            default:
                                reject("Invalid operator!");
                        };
                        break;
                    default:
                        resolve();
                        break;
                };
            });
        };

        this.statechecker = function(item){
            let output;
            switch(this.state){
                //initial command
                case 0:
                    output = "What is the first number in your calculation?";
                    this.state++;
                    break;
                //save the snippet
                case 1:
                    this.n1 = parseFloat(item.text.content);
                    output = "What operation does your caclulation do?";
                    this.state++;
                    break;
                //save the language
                case 2:
                    this.op = item.text.content;
                    output = "What is the last number in your calculation?";
                    this.state++;
                    break;
                
                case 3:
                    this.n2 = parseFloat(item.text.content);
                    let answer = this.calculate();
                    console.log(answer)
                    output = `Your answer is ${answer}.`;
                    console.log(output);
                    this.state++;
                    break;
                default:
                    output = "You find yourself in a unknown, scary place. How did you get here?";
                    this.state++;
                    break;
            };
            return output;
        };

        this.calculate = function(){
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
        };

    }

}