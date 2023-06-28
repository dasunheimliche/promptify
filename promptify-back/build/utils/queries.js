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
const graphql_1 = require("graphql");
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const Card_1 = __importDefault(require("../models/Card"));
const Topic_1 = __importDefault(require("../models/Topic"));
const Ai_1 = __importDefault(require("../models/Ai"));
const Query = {
    hello: () => "Hello world!",
    me: (_root, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const curr = context === null || context === void 0 ? void 0 : context.currentUser;
            if (!curr)
                return null;
            return curr;
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
    }),
    getInvalidUsernames: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield User_1.default.find({});
            const notAvaliableUsernames = users.map(user => user.username);
            return notAvaliableUsernames;
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
    }),
    getAis: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const curr = yield (context === null || context === void 0 ? void 0 : context.currentUser);
            if (!curr)
                return null;
            const { meId } = args;
            const ais = yield Ai_1.default.find({
                userId: new mongoose_1.default.Types.ObjectId(meId),
            });
            return ais;
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
    }),
    getTopics: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const curr = yield (context === null || context === void 0 ? void 0 : context.currentUser);
            if (!curr)
                return null;
            const { mainId } = args;
            const topics = yield Topic_1.default.find({
                aiId: new mongoose_1.default.Types.ObjectId(mainId),
            });
            return topics;
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
    }),
    getCards: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const curr = yield (context === null || context === void 0 ? void 0 : context.currentUser);
            if (!curr)
                return null;
            const { topicId } = args;
            const cards = yield Card_1.default.find({
                topicId: new mongoose_1.default.Types.ObjectId(topicId),
            });
            return cards;
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
    }),
};
exports.default = Query;
