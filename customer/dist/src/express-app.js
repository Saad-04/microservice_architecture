"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const cors = require('cors');
const { customer, appEvents } = require('./api');
// const { CreateChannel, SubscribeMessage } = require('./utils')
module.exports = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'));
    //api
    // appEvents(app);
    // const channel = await CreateChannel()
    customer(app);
    // error handling
});
