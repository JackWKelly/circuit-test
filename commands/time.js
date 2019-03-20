const axios = require("axios");
const url = "http://worldtimeapi.org/api/timezone/Europe/London.txt";

module.exports = {

    name: "Time",

    trigger: "!time",

    payload: async function(){
        let time = await axios.get(url)
        return time.data;
    },

}