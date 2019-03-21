
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
            return (item === this.triggerPhrase);
        };
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
                default:
                    return("and so on...");
            };
        }

    }

}