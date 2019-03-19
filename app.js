"use strict";

const secret = require('./secret');
const circuit = require('circuit-sdk');

const modules = require('./internal');

const barrybot = function(){

    const self = this;
    var client = new circuit.Client;

    this.loginBot = function(){
        modules.controller.loginBot();
    };
};

//main
const bot = new barrybot();
bot.loginBot();

module.exports = bot;