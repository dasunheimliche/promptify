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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const graphql_1 = require("graphql");
const getCurrentUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req) {
            return null;
        }
        // ! ALERTA: debo enviar el token sin comillas desde apollo-server sino llegaran con comillas extras y el startsWith no va a funcionar
        const auth = req.headers.authorization;
        if (!auth) {
            return null;
        }
        if (auth && auth.startsWith("Bearer ")) {
            const decodedToken = jsonwebtoken_1.default.verify(auth.substring(7), process.env.SECRET || "");
            const current = yield User_1.default.findById(decodedToken.id);
            return current;
        }
        return null;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new graphql_1.GraphQLError(error.message, {
                extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
        }
        else {
            throw new graphql_1.GraphQLError("An unknown error occurred", {
                extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
        }
    }
});
exports.getCurrentUser = getCurrentUser;
