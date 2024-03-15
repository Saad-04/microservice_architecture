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
const CustomerService = require("../services/customer-service");
const UserAuth = require("./middlewares/auth");
// const { SubscribeMessage } = require("../utils");
module.exports = (app, channel) => {
    const service = new CustomerService();
    // To listen
    // SubscribeMessage(channel, service);
    app.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password, phone } = req.body;
        const { data } = yield service.SignUp({ email, password, phone });
        res.json(data);
    }));
    app.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        const { data } = yield service.SignIn({ email, password });
        res.json(data);
    }));
    app.post("/address", UserAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { _id } = req.user;
        const { street, postalCode, city, country } = req.body;
        const { data } = yield service.AddNewAddress(_id, {
            street,
            postalCode,
            city,
            country,
        });
        res.json(data);
    }));
    app.get("/profile", UserAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { _id } = req.user;
        const { data } = yield service.GetProfile({ _id });
        res.json(data);
    }));
    app.get("/shoping-details", UserAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { _id } = req.user;
        const { data } = yield service.GetShopingDetails(_id);
        return res.json(data);
    }));
    app.get("/wishlist", UserAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { _id } = req.user;
        const { data } = yield service.GetWishList(_id);
        return res.status(200).json(data);
    }));
    app.get("/whoami", (req, res, next) => {
        return res.status(200).json({ msg: "/customer : I am Customer Service" });
    });
};
