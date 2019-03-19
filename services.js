"use strict";

const circuit = require('circuit-sdk');
const secret = require('./secret');
const modules = require('./internal');
const bot = require('./app');

var exports = module.exports = {};

exports.loginBot = function(){
    return new Promise(function (resolve,reject){
        console.log("Begin login process.")
        let client = new circuit.Client({
            client_id: secret.client_id,
            client_secret: secret.client_secret,
            domain: secret.domain
        });
        console.log("Adding listeners.");
        modules.routes.addEventListeners(client);
        console.log("Listeners added.");
        console.log("Begin authentication");
        client.logon()
        .then(function loggedOn(user){
            console.log("Logged on" + user);
            console.log("Authentication success.")
            client.setPresence({state: circuit.Enums.PresenceState.AVAILABLE});
            bot.client = client;
        })
        console.log("Authentication success.")
    });
};

/*const addEventListeners = function (client){
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
        controller.reply(evt.item);
    });
    client.addEventListener('itemUpdated', function (evt) {
        console.log(evt);
        controller.reply(evt.item);

    });
};*/

//helper from docs
exports.sentByMe = function sentByMe(item){
    return(bot.client.loggedOnUser.userId === item.creatorId);
}

exports.sendMessage = function(item){
    return bot.client.addTextItem(item.convId, item);
}