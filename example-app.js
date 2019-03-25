"use strict";
//secret contains a json with client_id, client_secret and domain
const secret = require('./secret');
const circuit = require('circuit-sdk');

// Define the command controller - the base controller that handles the logic
const cmdController = require('./example-cmdController');

// Define the function to set up our client with event listeners
function addEventListeners(client) {
    client.addEventListener('itemAdded', (evt) => {
        cmdController.respond(client, evt.item);
    });
    client.addEventListener('itemUpdated', (evt) => {
        cmdController.respond(client, evt.item);
    });
}

// Client is the core of our app - it won't change so we
// define it as a const
const client = new circuit.Client({
    client_id: secret.client_id,
    client_secret: secret.client_secret,
    domain: secret.domain
});

// Initialise our circuit client - it's a multi-stage process
client.logon() // Login to the Circuit server
    .then(() => addEventListeners(client)) // Set up the chatbot event listeners
    .then(() => client.setPresence( // Set our presence to available on Circuit
        { state: circuit.Enums.PresenceState.AVAILABLE }))
    .then(() => console.log("Logged in")) // Login process complete and our bot is listening
    .catch((err) => console.error(err));
