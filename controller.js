"use strict";

const modules = require('./internal');
const bot = require('./app');

exports = module.exports = {}

const controller = {
        
        loginBot: function(){
            modules.services.loginBot()
            .then(results => {
                console.log("Login success.");
            })
            .catch(err => {
                console.log("Login failure: " + err);
            });
        },


        reply: function(item){
            if (!modules.services.sentByMe(item)) {
                let comment = {
                    convId: item.convId,
                    parentId: item.parentId,
                    content: "Hello world!"
                };
                return modules.services.sendMessage(comment);
            }
        }
    };

    module.exports = controller;