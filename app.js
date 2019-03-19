const secret = require('./secret');
const circuit = require('circuit-sdk');

barrybot = function(){

    const routes = require('./routes');
    const controller = require('./controller');
    const services = require('./services');
    const self = this;
    let client;

    this.loginBot = function(){
        return new Promise(function (resolve,reject){
            console.log("Begin login process.")
            let client = new circuit.Client({
                client_id: secret.client_id,
                client_secret: secret.client_secret,
                domain: secret.domain
            });
            console.log("Adding listeners.");
            self.addEventListeners(client);
            console.log("Listeners added.");
            console.log("Begin authentication");
            client.logon()
            .then(function loggedOn(user){
                console.log("Logged on" + user);
                return client.setPresence({state: circuit.Enums.PresenceState.AVAILABLE});
            })
            console.log("Authentication success.")

            self.client = client;
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
    this.addEventListeners = function(client){
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
            self.reply(evt.item);
        });
        client.addEventListener('itemUpdated', function (evt) {
            console.log(evt);
            self.reply(evt.item);

        });
    }

    //helper from docs
    this.sentByMe = function sentByMe(item){
        return(self.client.loggedOnUser.userId === item.creatorId);
    }

    this.reply = function reply(item){
        if (!self.sentByMe(item)) {
            let comment = {
                convId: item.convId,
                parentId: item.parentId,
                content: "Hello world!"
            };
            return self.client.addTextItem(item.convId, comment);
        }
    }
};
//main
bot = new barrybot();
bot.loginBot();