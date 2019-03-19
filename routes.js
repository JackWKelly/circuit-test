const modules = require('./internal');

const routes = {
//basically copied from docs
addEventListeners: function addEventListeners(client){
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
        modules.controller.reply(evt.item);
    });
    client.addEventListener('itemUpdated', function (evt) {
        console.log(evt);
        modules.controller.reply(evt.item);

    });
}
};

module.exports = routes;