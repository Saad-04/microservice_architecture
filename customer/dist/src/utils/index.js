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
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");
const { APP_SECRET, EXCHANGE_NAME, CUSTOMER_SERVICE, MSG_QUEUE_URL, } = require("../config");
//Utility functions
module.exports.GenerateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.genSalt();
});
module.exports.GeneratePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.hash(password, salt);
});
module.exports.ValidatePassword = (enteredPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield this.GeneratePassword(enteredPassword, salt)) === savedPassword;
});
module.exports.GenerateSignature = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
    }
    catch (error) {
        console.log(error);
        return error;
    }
});
module.exports.ValidateSignature = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const signature = req.get("Authorization");
        console.log(signature);
        const payload = yield jwt.verify(signature.split(" ")[1], APP_SECRET);
        req.user = payload;
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
});
module.exports.FormateData = (data) => {
    if (data) {
        return { data };
    }
    else {
        throw new Error("Data Not found!");
    }
};
//Message Broker
// module.exports.CreateChannel = async () => {
//   try {
//     const connection = await amqplib.connect(MSG_QUEUE_URL);
//     const channel = await connection.createChannel();
//     await channel.assertQueue(EXCHANGE_NAME, "direct", { durable: true });
//     return channel;
//   } catch (err) {
//     throw err;
//   }
// };
// module.exports.PublishMessage = (channel, service, msg) => {
//   channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
//   console.log("Sent: ", msg);
// };
// module.exports.SubscribeMessage = async (channel, service) => {
//   await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
//   const q = await channel.assertQueue("", { exclusive: true });
//   console.log(` Waiting for messages in queue: ${q.queue}`);
//   channel.bindQueue(q.queue, EXCHANGE_NAME, CUSTOMER_SERVICE);
//   channel.consume(
//     q.queue,
//     (msg) => {
//       if (msg.content) {
//         console.log("the message is:", msg.content.toString());
//         service.SubscribeEvents(msg.content.toString());
//       }
//       console.log("[X] received");
//     },
//     {
//       noAck: true,
//     }
//   );
// };
