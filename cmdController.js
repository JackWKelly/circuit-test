"use strict";

//commands to be looped t hrough
const commands = [
    require('./commands/helloWorld'),
    require('./commands/demo'),
    require('./commands/time')
];

module.exports = function(client, item){
    
    //helper from docs
    const sentByMe = function sentByMe(item){
        return(client.loggedOnUser.userId === item.creatorId);
    };
    
    const sendMessage = function(item){
        return client.addTextItem(item.convId, item);
    };
    
    //logic here
    if (!sentByMe(item)) {
        let output;
        for(let i = 0; i < commands.length; i++){
            if(commands[i].trigger === item.text.content){
                output = commands[i].payload()
                .then(output => {
                    let comment = {
                        convId: item.convId,
                        parentId: item.parentId,
                        content: output
                    };
                    sendMessage(comment);
                    return;
                })
            
            }
        }
    };
    

}
