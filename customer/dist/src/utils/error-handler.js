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
const { createLogger, transports } = require('winston');
const { AppError } = require('./app-errors');
const LogErrors = createLogger({
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'app_error.log' })
    ]
});
class ErrorLogger {
    constructor() { }
    logError(err) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('==================== Start Error Logger ===============');
            LogErrors.log({
                private: true,
                level: 'error',
                message: `${new Date()}-${JSON.stringify(err)}`
            });
            console.log('==================== End Error Logger ===============');
            // log error with Logger plugins
            return false;
        });
    }
    isTrustError(error) {
        if (error instanceof AppError) {
            return error.isOperational;
        }
        else {
            return false;
        }
    }
}
const ErrorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errorLogger = new ErrorLogger();
    process.on('uncaughtException', (reason, promise) => {
        console.log(reason, 'UNHANDLED');
        throw reason; // need to take care
    });
    process.on('uncaughtException', (error) => {
        errorLogger.logError(error);
        if (errorLogger.isTrustError(err)) {
            //process exist // need restart
        }
    });
    // console.log(err.description, '-------> DESCRIPTION')
    // console.log(err.message, '-------> MESSAGE')
    // console.log(err.name, '-------> NAME')
    if (err) {
        yield errorLogger.logError(err);
        if (errorLogger.isTrustError(err)) {
            if (err.errorStack) {
                const errorDescription = err.errorStack;
                return res.status(err.statusCode).json({ 'message': errorDescription });
            }
            return res.status(err.statusCode).json({ 'message': err.message });
        }
        else {
            //process exit // terriablly wrong with flow need restart
        }
        return res.status(err.statusCode).json({ 'message': err.message });
    }
    next();
});
module.exports = ErrorHandler;
