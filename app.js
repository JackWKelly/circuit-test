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

        // MF: I would avoid this - adding modules as variables
        // MF: increases complexity and reduces code readability.
        // MF: I would either move the require in the class, or
        // MF: just refer to the original import from within the class
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
        // MF: We generally try and avoid creating new Promises where possible
        // MF: This is normally handled by the underlying operations that are occuring
        // MF: Here - the base action is logon, so we should use the promise from
        // MF: That, and then do promise chaining. See example-app for details
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
        // MF: Remove the unused event listeners to improve readability
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
