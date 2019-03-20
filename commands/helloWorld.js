
module.exports = {

    name: "Hello World",

    trigger: "!hello",

    payload: async function(){
        return "Hello World!";
    }

}