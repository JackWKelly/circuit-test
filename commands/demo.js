
module.exports = {

    name: "Demo",

    trigger: "!demo",

    payload: async function(){
        return "Hello, I am the 'demo' command, I live in my own module.";
    }

}