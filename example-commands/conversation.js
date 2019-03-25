const Context = require('./context')
const Promise = require('bluebird');

module.exports = class ConversationCommand extends Context {

    constructor() {
        super();

        this.step = 0;
    }

    // Handle the message - this command doesn't rely on the input
    // so we will ignore it and just return the response based on the
    // step we are currently on in the conversation
    handleMessage() {

        // Get the message for the current step the conversation is on
        var response = null;

        switch(this.step) {
            case 0: response = "State 1!"; break;
            case 1: response = "State 2!"; break;
            case 2: response = "and so on..."; break;
            default: response = "How did you get here?"; break;
        }

        // Increment the step counter
        this.step = this.step + 1;

        // Return the response
        return Promise.resolve(response);
    }

    // This conversation is over after the 3rd state
    isConversationEnded() {
        return this.step > 2;
    }
}