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
const mongoose = require('mongoose');
const { CustomerModel, AddressModel } = require('../models');
//Dealing with data base operations
class CustomerRepository {
    CreateCustomer(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password, phone, salt }) {
            const customer = new CustomerModel({
                email,
                password,
                salt,
                phone,
                address: []
            });
            const customerResult = yield customer.save();
            return customerResult;
        });
    }
    CreateAddress(_a) {
        return __awaiter(this, arguments, void 0, function* ({ _id, street, postalCode, city, country }) {
            const profile = yield CustomerModel.findById(_id);
            if (profile) {
                const newAddress = new AddressModel({
                    street,
                    postalCode,
                    city,
                    country
                });
                yield newAddress.save();
                profile.address.push(newAddress);
            }
            return yield profile.save();
        });
    }
    FindCustomer(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email }) {
            const existingCustomer = yield CustomerModel.findOne({ email: email });
            return existingCustomer;
        });
    }
    FindCustomerById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            const existingCustomer = yield CustomerModel.findById(id).populate('address');
            // existingCustomer.cart = [];
            // existingCustomer.orders = [];
            // existingCustomer.wishlist = [];
            // await existingCustomer.save();
            return existingCustomer;
        });
    }
    Wishlist(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield CustomerModel.findById(customerId).populate('wishlist');
            return profile.wishlist;
        });
    }
    AddWishlistItem(customerId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (customerId, { _id, name, desc, price, available, banner }) {
            const product = {
                _id, name, desc, price, available, banner
            };
            const profile = yield CustomerModel.findById(customerId).populate('wishlist');
            if (profile) {
                let wishlist = profile.wishlist;
                if (wishlist.length > 0) {
                    let isExist = false;
                    wishlist.map(item => {
                        if (item._id.toString() === product._id.toString()) {
                            const index = wishlist.indexOf(item);
                            wishlist.splice(index, 1);
                            isExist = true;
                        }
                    });
                    if (!isExist) {
                        wishlist.push(product);
                    }
                }
                else {
                    wishlist.push(product);
                }
                profile.wishlist = wishlist;
            }
            const profileResult = yield profile.save();
            return profileResult.wishlist;
        });
    }
    AddCartItem(customerId_1, _a, qty_1, isRemove_1) {
        return __awaiter(this, arguments, void 0, function* (customerId, { _id, name, price, banner }, qty, isRemove) {
            const profile = yield CustomerModel.findById(customerId).populate('cart');
            if (profile) {
                const cartItem = {
                    product: { _id, name, price, banner },
                    unit: qty,
                };
                let cartItems = profile.cart;
                if (cartItems.length > 0) {
                    let isExist = false;
                    cartItems.map(item => {
                        if (item.product._id.toString() === _id.toString()) {
                            if (isRemove) {
                                cartItems.splice(cartItems.indexOf(item), 1);
                            }
                            else {
                                item.unit = qty;
                            }
                            isExist = true;
                        }
                    });
                    if (!isExist) {
                        cartItems.push(cartItem);
                    }
                }
                else {
                    cartItems.push(cartItem);
                }
                profile.cart = cartItems;
                return yield profile.save();
            }
            throw new Error('Unable to add to cart!');
        });
    }
    AddOrderToProfile(customerId, order) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield CustomerModel.findById(customerId);
            if (profile) {
                if (profile.orders == undefined) {
                    profile.orders = [];
                }
                profile.orders.push(order);
                profile.cart = [];
                const profileResult = yield profile.save();
                return profileResult;
            }
            throw new Error('Unable to add to order!');
        });
    }
}
module.exports = CustomerRepository;
