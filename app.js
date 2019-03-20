"use strict";

const secret = require('./secret');
const circuit = require('circuit-sdk');
const cmdControllerModule = require('./cmdController');

class barrybot{

    constructor(){
        this.cmdController = cmdControllerModule;
        this.client = new circuit.Client({
            client_id: secret.client_id,
            client_secret: secret.client_secret,
            domain: secret.domain
        });
        this.login()
        .then(function(){
            console.log("Logged in");
        })
        .catch(function(err){
            console.log(err);
        });
    };
    

    login(){
        return new Promise((resolve,reject) => {
            this.addEventListeners();
            this.client.logon()

            .then(() => {
                this.client.setPresence({state: circuit.Enums.PresenceState.AVAILABLE});
                resolve();
            })
        });
    };

    //basically copied from docs
    addEventListeners(){
        //set event callbacks for this client
        this.client.addEventListener('connectionStateChanged', function (evt) {
            console.log(evt);
        });
        this.client.addEventListener('registrationStateChanged', function (evt) {
            console.log(evt);
        });
        this.client.addEventListener('reconnectFailed', function (evt) {
            console.log(evt);
        });
        this.client.addEventListener('itemAdded', (evt) => {
            console.log(evt);
            this.cmdController(this.client, evt.item);
        });
        this.client.addEventListener('itemUpdated', (evt) => {
            console.log(evt);
            this.cmdController(this.client, evt.item);
        });
    }

};

//main
const bot = new barrybot();
