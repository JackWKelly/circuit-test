"use strict";

module.exports = function(client, item){
    const reply = function(item){
        if (!sentByMe(item)) {
            let comment = {
            convId: item.convId,
            parentId: item.parentId,
            content: "Hello world!"
            };
            sendMessage(comment);
        }
    };
    
    //helper from docs
    const sentByMe = function sentByMe(item){
        return(client.loggedOnUser.userId === item.creatorId);
    };
    
    const sendMessage = function(item){
        return client.addTextItem(item.convId, item);
    };
    
    //logic here

    reply(item);

}
