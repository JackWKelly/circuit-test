"use strict";
var exports = module.exports = {}

var Promise = require("bluebird");

const commands = {
    "!hello": require('./example-commands/helloWorld'),
    "!conv": require('./example-commands/conversation'),
    "!calc": require('./example-commands/conversationalCalculator'),
    "!mf": require('./example-commands/monsterFighter/monsterFighter'),
    "!time": require('./example-commands/time')
}

// We will use a dictionary to manage users conversational contexts
const userContexts = new Map();

// Get the context for a given User Id
function getUserContext(userId) {
    return userContexts.get(userId);
}

// Set the context to a given User Id
function addUserContext(userId, context) {
    userContexts.set(userId, context);
}

// Delete the context from a user
function clearUserContext(userId) {
    userContexts.delete(userId);
}

// Send a message to a Circuit client
function sendMessage(client, item) {
    return client.addTextItem(item.convId, item.content);
};

// Check if a command exists
function commandExists(command) {
    return (commands[command] != undefined)
}

exports.respond = (client, item) => {
    // We only want to respond to messages from others, not our own bot
    if (client.loggedOnUser.userId !== item.creatorId) {

        // First, check if the user has an active context
        let currentContext = getUserContext(item.creatorId);

        if (!currentContext) {
            // If there is no active context - we will create a context based on the command
            // and set it to the user. First we check if a command exists
            if (commandExists(item.text.content)) {
                // If it does exist, we can create the context
                currentContext = new commands[item.text.content]();
                addUserContext(item.creatorId, currentContext);
            }
        }

        // We only continue if we have a context - without a context we won't respond as there is no
        // active conversation
        if (currentContext) {
            // Now we know the user has an active context, we will use it to create a response to
            // the users message
            Promise.resolve(currentContext.handleMessage(item.text.content))
                .then(response => {
                    const responseItem = {
                        convId: item.convId,
                        content: {
                            content: response,
                            parentId: item.parentItemId
                        }
                    };

                    return responseItem;
                })
                // Send the message back to the client
                .then(item => sendMessage(client, item))
                .then(() => {
                    // We now want to wipe the context if the conversation has now ended
                    if (currentContext.isConversationEnded()) {
                        clearUserContext(item.creatorId);
                    }
                })
        }
    }
}
