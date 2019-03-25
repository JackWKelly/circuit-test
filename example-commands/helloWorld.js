const Context = require('./context')

module.exports = class HelloCommand extends Context {

    constructor() {
        super();
    }

    handleMessage(input) {
        return "Hello World!"
    }

    // For the Hello command, it is not a long running conversation
    // So the conversation has always ended
    isConversationEnded() {
        return true;
    }
}