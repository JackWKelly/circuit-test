const config = require('./secret');

const util = require('util');
const assert = require('assert');
const url = require('url');

const circuit = require('circuit-sdk');

var botClient;

loginBot = function(){
    return new Promise(function (resolve,reject){
        console.log("Begin login process.")
        let client = new circuit.Client({
            client_id: config.client_id,
            client_secret: config.client_secret,
            domain: config.domain
        });
        console.log("Adding listeners.");
        addEventListeners(client);
        console.log("Listeners added.");
        console.log("Begin authentication");
        client.logon()
        .then(function loggedOn(user){
            console.log("Logged on" + user);
            return client.setPresence({state: circuit.Enums.PresenceState.AVAILABLE});
        })
        console.log("Authentication success.")

        

        this.botClient = client;
        resolve();
    })
        .then(results => {
            console.log("Login success.");
        })
        .catch(err => {
            console.log("Login failure: " + err);
        });
}

//basically copied from docs
addEventListeners = function addEventListeners(client){
    //set event callbacks for this client
    client.addEventListener('connectionStateChanged', function (evt) {
        console.log(evt);
    });
    client.addEventListener('registrationStateChanged', function (evt) {
        console.log(evt);
    });
    client.addEventListener('reconnectFailed', function (evt) {
        console.log(evt);
    });
    client.addEventListener('itemAdded', function (evt) {
        console.log(evt);
        reply(evt.item);
    });
    client.addEventListener('itemUpdated', function (evt) {
        console.log(evt);
        reply(evt.item);

    });
}

//helper from docs
sentByMe = function sentByMe(item){
    return(this.botClient.loggedOnUser.userId === item.creatorId);
}

reply = function reply(item){
    if (!sentByMe(item)) {
        let comment = {
            convId: item.convId,
            parentId: item.parentId,
            content: "Hello world!"
        };
        return this.botClient.addTextItem(item.convId, comment);
    }
}

//main
loginBot(botClient);