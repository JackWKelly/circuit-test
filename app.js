"use strict";

//secret contains a json with client_id, client_secret and domain
const secret = require('./secret');
const circuit = require('circuit-sdk');
const cmdControllerModule = require('./cmdController');

// MF: Use Title Case for classes - BarryBot
// MF: This convention allows us to easily differentiate between classes and variables
// MF: Also use an auto-formatter - this keeps the files in consistent formats
// MF: (it will add spaces and indents to improve readability)
class barrybot{

    constructor(){
        this.cmdController = cmdControllerModule;
        //set client data to predefined secret data
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
    //set event callbacks for this client
    //use fat arrows to keep "this" context
    addEventListeners(){
        this.client.addEventListener('connectionStateChanged', (evt) => {
            //console.log(evt);
        });
        this.client.addEventListener('registrationStateChanged', (evt) => {
            //console.log(evt);
        });
        this.client.addEventListener('reconnectFailed', (evt) => {
            //console.log(evt);
        });
        this.client.addEventListener('itemAdded', (evt) => {
            //console.log(evt);
            this.cmdController(this.client, evt.item);
        });
        this.client.addEventListener('itemUpdated', (evt) => {
            //console.log(evt);
            this.cmdController(this.client, evt.item);
        });
    }

};

//main
const bot = new barrybot();
