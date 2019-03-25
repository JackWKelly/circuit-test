
module.exports = {

    name: "Conversation",

    trigger: "!conv",

    payload: async function(item){
        return new convTest;
    }

}

class convTest{

    constructor(){
        this.triggerPhrase = "!conv";
        this.trigger = function(item){
            return (item.text.content === this.triggerPhrase);
        };
        this.completionState = 3;
        this.state = 0;
        this.payload = async function(){           
            let output = this.statechecker();
            this.state++;
            return output;
        };

        this.statechecker = function(){
            switch(this.state){
                case 0:
                    return("State 1!");
                case 1:
                    return("State 2!");
                case 2:
                    return("and so on...");
                default:
                    this.state = 3;
                    return("How did you get here?");
            };
        }

    }

}