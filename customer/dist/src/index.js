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
const express = require("express");
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");
const { CreateChannel } = require("./utils");
const StartServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express();
    yield databaseConnection();
    // const channel = await CreateChannel();
    yield expressApp(app);
    app
        .listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
    })
        .on("error", (err) => {
        console.log(err);
        process.exit();
    })
        .on("close", () => {
        // channel.close();
    });
});
StartServer();
