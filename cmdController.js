"use strict";

//commands to be looped through
const commands = [
    require('./commands/helloWorld'),
    require('./commands/demo'),
    require('./commands/time'),
    require('./commands/conversation'),
    require('./commands/codesave'),
    require('./commands/convoCalculator')
];

//multi stage commands create one of these to store state while waiting for input
const conversations = [];

module.exports = function(client, item){
    
    //helper from docs
    const sentByMe = function sentByMe(item){
        return(client.loggedOnUser.userId === item.creatorId);
    };
    
    const sendMessage = function(item){
        console.log(item.content);
        return client.addTextItem(item.convId, item.content);
    };
    
    //logic here
    if (!sentByMe(item)) {

        let convUsed = false; //tracks if a conversation commands has been used, refactor later

        //remove any completed conversations
        if(conversations.length > 0){
            //reverse through the array as to not cause shifts in element numbers while we're checking
            for(let i = (conversations.length -1); i >= 0 ; i--){
                if(conversations[i].state >= conversations[i].completionState){
                    conversations.splice(i, 1);
                };
            };
        }

        //check if there's a currently active conversation instance for this input first
        for(let i = 0; i < conversations.length; i++){
            if(conversations[i].trigger(item.text.content)){
                conversations[i].payload(item)
                .then(output => {
                    //gotta love javascript, apparantly this is how you check for strings
                    if(output.constructor === String){
                        let comment = {
                            convId: item.convId,
                            content: {
                                content: output,
                                parentId: item.parentItemId
                            }
                        };
                        sendMessage(comment);
                    };
                })
                .catch(error => {
                    console.log(error);
                });
                convUsed = true;
            
            }
        };

        //don't check commands if a conversation has been used instead, to prevent duplicates (refactor later)
        if(convUsed){
            return;
        }

        //if not, check commands normally
        for(let i = 0; i < commands.length; i++){
            if(commands[i].trigger === item.text.content){
                commands[i].payload(item)
                .then(async (output) => {
                    //command started a conversation
                    if (output instanceof Object){
                        conversations.push(output)
                        await output.payload(item)
                        .then(result => {
                            output = result;
                        })
                        .catch(err => {
                            console.log(err);
                        });
                    };
                    //gotta love javascript, apparantly this is how you check for strings
                    if(output.constructor === String){
                        let comment = {
                            convId: item.convId,
                            content: {
                                content: output,
                                parentId: item.parentItemId
                            }
                        };
                        sendMessage(comment)
                        .catch(err => {
                            console.log(err);
                        });
                    };
                return;
                })
                .catch(error => {
                    console.log(error);
                });
            
            }
        };
    };
    

}
