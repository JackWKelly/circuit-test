"use strict";
const axios = require("axios");
const url = "http://worldtimeapi.org/api/timezone/Europe/London.txt";
const Context = require('./context')

module.exports = class HelloCommand extends Context {

    constructor() {
        super();
    }

    async handleMessage() {
        let time = await axios.get(url)
        return time.data;
    }

    // For the Hello command, it is not a long running conversation
    // So the conversation has always ended
    isConversationEnded() {
        return true;
    }
}