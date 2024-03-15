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
const { CustomerRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword, } = require("../utils");
// All Business logic will be here
class CustomerService {
    constructor() {
        this.repository = new CustomerRepository();
    }
    SignIn(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = userInputs;
            const existingCustomer = yield this.repository.FindCustomer({ email });
            if (existingCustomer) {
                const validPassword = yield ValidatePassword(password, existingCustomer.password, existingCustomer.salt);
                if (validPassword) {
                    const token = yield GenerateSignature({
                        email: existingCustomer.email,
                        _id: existingCustomer._id,
                    });
                    return FormateData({ id: existingCustomer._id, token });
                }
            }
            return FormateData(null);
        });
    }
    SignUp(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, phone } = userInputs;
            // create salt
            let salt = yield GenerateSalt();
            let userPassword = yield GeneratePassword(password, salt);
            const existingCustomer = yield this.repository.CreateCustomer({
                email,
                password: userPassword,
                phone,
                salt,
            });
            const token = yield GenerateSignature({
                email: email,
                _id: existingCustomer._id,
            });
            return FormateData({ id: existingCustomer._id, token });
        });
    }
    AddNewAddress(_id, userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { street, postalCode, city, country } = userInputs;
            const addressResult = yield this.repository.CreateAddress({
                _id,
                street,
                postalCode,
                city,
                country,
            });
            return FormateData(addressResult);
        });
    }
    GetProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCustomer = yield this.repository.FindCustomerById({ id });
            return FormateData(existingCustomer);
        });
    }
    GetShopingDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCustomer = yield this.repository.FindCustomerById({ id });
            if (existingCustomer) {
                // const orders = await this.shopingRepository.Orders(id);
                return FormateData(existingCustomer);
            }
            return FormateData({ msg: "Error" });
        });
    }
    GetWishList(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wishListItems = yield this.repository.Wishlist(customerId);
            return FormateData(wishListItems);
        });
    }
    AddToWishlist(customerId, product) {
        return __awaiter(this, void 0, void 0, function* () {
            const wishlistResult = yield this.repository.AddWishlistItem(customerId, product);
            return FormateData(wishlistResult);
        });
    }
    ManageCart(customerId, product, qty, isRemove) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartResult = yield this.repository.AddCartItem(customerId, product, qty, isRemove);
            return FormateData(cartResult);
        });
    }
    ManageOrder(customerId, order) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderResult = yield this.repository.AddOrderToProfile(customerId, order);
            return FormateData(orderResult);
        });
    }
    SubscribeEvents(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Triggering.... Customer Events");
            payload = JSON.parse(payload);
            const { event, data } = payload;
            const { userId, product, order, qty } = data;
            switch (event) {
                case "ADD_TO_WISHLIST":
                case "REMOVE_FROM_WISHLIST":
                    this.AddToWishlist(userId, product);
                    break;
                case "ADD_TO_CART":
                    this.ManageCart(userId, product, qty, false);
                    break;
                case "REMOVE_FROM_CART":
                    this.ManageCart(userId, product, qty, true);
                    break;
                case "CREATE_ORDER":
                    this.ManageOrder(userId, order);
                    break;
                default:
                    break;
            }
        });
    }
}
module.exports = CustomerService;
