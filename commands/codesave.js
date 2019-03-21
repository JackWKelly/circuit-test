
module.exports = {

    name: "Conversation",

    trigger: "!codesave",

    payload: async function(item){
        return new convTest;
    }

}

class convTest{

    constructor(){
        this.trigger = function(item){
            return true;
        };

        this.snippet = {};

        this.state = 0;
        this.payload = async function(item){          
            let output = this.statechecker(item);
            return output;
        };

        this.statechecker = function(item){
            let output;
            switch(this.state){
                //initial command
                case 0:
                    output = "Let's save a code snippet. What code do you want to save?";
                    this.state++;
                    break;
                //save the snippet
                case 1:
                    this.snippet.code = item.text.content;
                    output = "And what language is that?";
                    this.state++;
                    break;
                //save the language
                case 2:
                    this.snippet.lang = item.text.content;
                    output = " Are there any other tags you want associated with the snippet?";
                    this.state++;
                    break;
                case 3:
                    this.snippet.tags = item.text.content;
                    output = `Thanks, your snippet is:<hr>${JSON.stringify(this.snippet)}`;
                    this.state++;
                    break;
                default:
                    output = "You find yourself in a unknown, scary place. How did you get here?";
                    this.state++;
                    break;
            };
            return output;
        }

    }

}