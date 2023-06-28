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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Card_1 = __importDefault(require("../models/Card"));
const Topic_1 = __importDefault(require("../models/Topic"));
const Ai_1 = __importDefault(require("../models/Ai"));
const Mutation = {
    createUser: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const curr = yield (context === null || context === void 0 ? void 0 : context.currentUser);
        if (!curr)
            throw new Error("Failed to fetch context");
        const { name, lastname, username, password, email } = args;
        const saltRounds = 10;
        const hashPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const user = new User_1.default({
            name, lastname, username, password: hashPassword, email, allPrompts: []
        });
        return user.save()
            .catch(error => {
            throw new graphql_1.GraphQLError("Creating the user failed", {
                extensions: {
                    code: "BAD_USER_INPUT",
                    invalidArgs: args,
                    error
                }
            });
        });
    }),
    createAi: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const curr = yield (context === null || context === void 0 ? void 0 : context.currentUser);
        if (!curr)
            throw new Error("Failed to fetch context");
        const { userId, ai } = args;
        const newAi = new Ai_1.default({
            name: ai.name,
            abb: ai.abb,
            fav: false,
            userId: new mongoose_1.default.Types.ObjectId(userId),
            topics: []
        });
        const nuevaAi = yield newAi.save()
            .catch(error => {
            throw new graphql_1.GraphQLError("Creating the user failed", {
                extensions: {
                    code: "BAD_USER_INPUT",
                    invalidArgs: args,
                    error
                }
            });
        });
        const user = yield User_1.default.findById(userId);
        if (user) {
            user.allPrompts = (_a = user.allPrompts) === null || _a === void 0 ? void 0 : _a.concat(nuevaAi.id);
            yield user.save();
        }
        return nuevaAi;
    }),
    createTopic: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const me = yield (context === null || context === void 0 ? void 0 : context.currentUser);
        if (!me)
            throw new Error("Failed to fetch context");
        const { aiId, topic } = args;
        // const me = await context.currentUser;
        const aIdObject = new mongoose_1.default.Types.ObjectId(aiId);
        const newTopic = new Topic_1.default({
            userId: me._id,
            aiId: aIdObject,
            name: topic.name,
            fav: false,
            cards: []
        });
        const nuevoTopic = yield newTopic.save()
            .catch(error => {
            throw new graphql_1.GraphQLError("Creating the user failed", {
                extensions: {
                    code: "BAD_USER_INPUT",
                    invalidArgs: args,
                    error
                }
            });
        });
        const ai = yield Ai_1.default.findById(aiId);
        if (ai) {
            ai.topics = (_b = ai.topics) === null || _b === void 0 ? void 0 : _b.concat(nuevoTopic.id);
            yield ai.save();
        }
        return nuevoTopic;
    }),
    createCard: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const me = yield (context === null || context === void 0 ? void 0 : context.currentUser);
        if (!me)
            throw new Error("Failed to fetch context");
        const { topicId, aiId, card } = args;
        // const me = await context.currentUser;
        const aIdObject = new mongoose_1.default.Types.ObjectId(aiId);
        const topicIdObject = new mongoose_1.default.Types.ObjectId(topicId);
        const newCard = new Card_1.default({
            userId: me._id,
            aiId: aIdObject,
            topicId: topicIdObject,
            title: card.title,
            fav: false,
            prompts: card.prompts
        });
        const nuevaCard = yield newCard.save()
            .catch(error => {
            throw new graphql_1.GraphQLError("Creating the user failed", {
                extensions: {
                    code: "BAD_USER_INPUT",
                    invalidArgs: args,
                    error
                }
            });
        });
        const topic = yield Topic_1.default.findById(topicId);
        if (topic) {
            topic.cards = (_c = topic.cards) === null || _c === void 0 ? void 0 : _c.concat(nuevaCard.id);
            yield topic.save();
        }
        return nuevaCard;
    }),
    login: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({ username: args.username });
            if (!user) {
                throw new graphql_1.GraphQLError("User not found", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }
            const passCorrect = yield bcrypt_1.default.compare(args.password, user.password);
            if (!passCorrect) {
                throw new graphql_1.GraphQLError("Wrong credentials", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }
            const userForToken = {
                username: user.username,
                id: user._id,
            };
            const token = jsonwebtoken_1.default.sign(userForToken, process.env.SECRET || "");
            return { value: token };
        }
        catch (error) {
            if (error instanceof graphql_1.GraphQLError) {
                throw error;
            }
            else if (error instanceof Error) {
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
    deleteCard: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const curr = yield (context === null || context === void 0 ? void 0 : context.currentUser);
            if (!curr)
                throw new Error("Failed to fetch context");
            const { cardId, topicId } = args;
            const cardIdObject = new mongoose_1.default.Types.ObjectId(cardId);
            const topicIdObject = new mongoose_1.default.Types.ObjectId(topicId);
            yield Card_1.default.findByIdAndDelete(cardId);
            yield Topic_1.default.updateOne({ _id: topicIdObject }, { $pull: { cards: cardIdObject } });
            return true;
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
    deleteTopic: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const curr = yield (context === null || context === void 0 ? void 0 : context.currentUser);
            if (!curr)
                throw new Error("Failed to fetch context");
            const { aiId, topicId } = args;
            const topic = yield Topic_1.default.findById(topicId);
            if (!topic) {
                return false;
            }
            const aiIdObject = new mongoose_1.default.Types.ObjectId(aiId);
            const topicIdObject = new mongoose_1.default.Types.ObjectId(topicId);
            yield Card_1.default.deleteMany({ topicId: topicIdObject });
            yield Topic_1.default.findByIdAndDelete(topicId);
            yield Ai_1.default.updateOne({ _id: aiIdObject }, { $pull: { topics: topicIdObject } });
            return true;
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
    deleteAi: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const curr = yield (context === null || context === void 0 ? void 0 : context.currentUser);
            if (!curr)
                throw new Error("Failed to fetch context");
            const { userId, aiId } = args;
            const userIdObject = new mongoose_1.default.Types.ObjectId(userId);
            const aiIdObject = new mongoose_1.default.Types.ObjectId(aiId);
            yield Card_1.default.deleteMany({ aiId: aiIdObject });
            yield Topic_1.default.deleteMany({ aiId: aiIdObject });
            yield Ai_1.default.findByIdAndDelete(aiId);
            yield User_1.default.updateOne({ _id: userIdObject }, { $pull: { allPrompts: aiIdObject } });
            return true;
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
    addCardToFavs: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const curr = yield (context === null || context === void 0 ? void 0 : context.currentUser);
            if (!curr)
                throw new Error("Failed to fetch context");
            const { cardId } = args;
            const card = yield Card_1.default.findById(cardId);
            if (!card) {
                throw new graphql_1.GraphQLError("Card not found", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }
            card.fav = !card.fav;
            yield card.save();
            return card;
        }
        catch (error) {
            if (error instanceof graphql_1.GraphQLError) {
                throw error;
            }
            else if (error instanceof Error) {
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
    addAiToFavs: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const curr = yield (context === null || context === void 0 ? void 0 : context.currentUser);
            if (!curr)
                throw new Error("Failed to fetch context");
            const { aiId } = args;
            const ai = yield Ai_1.default.findById(aiId);
            if (!ai) {
                throw new graphql_1.GraphQLError("AI not found", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }
            ai.fav = !ai.fav;
            yield ai.save();
            return ai;
        }
        catch (error) {
            if (error instanceof graphql_1.GraphQLError) {
                throw error;
            }
            else if (error instanceof Error) {
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
    addTopicToFavs: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const curr = yield (context === null || context === void 0 ? void 0 : context.currentUser);
            if (!curr)
                throw new Error("Failed to fetch context");
            const { topicId } = args;
            const topic = yield Topic_1.default.findById(topicId);
            if (!topic) {
                throw new graphql_1.GraphQLError("Topic not found", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }
            topic.fav = !topic.fav;
            yield topic.save();
            return topic;
        }
        catch (error) {
            if (error instanceof graphql_1.GraphQLError) {
                throw error;
            }
            else if (error instanceof Error) {
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
    editAi: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const curr = yield (context === null || context === void 0 ? void 0 : context.currentUser);
            if (!curr)
                throw new Error("Failed to fetch context");
            const { aiId, newName } = args;
            const ai = yield Ai_1.default.findById(aiId);
            if (!ai) {
                throw new graphql_1.GraphQLError("AI not found", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }
            ai.name = newName;
            return yield ai.save();
        }
        catch (error) {
            if (error instanceof graphql_1.GraphQLError) {
                throw error;
            }
            else if (error instanceof Error) {
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
    editTopic: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const curr = yield (context === null || context === void 0 ? void 0 : context.currentUser);
            if (!curr)
                throw new Error("Failed to fetch context");
            const { topicId, newName } = args;
            const topic = yield Topic_1.default.findById(topicId);
            if (!topic) {
                throw new graphql_1.GraphQLError("Topic not found", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }
            topic.name = newName;
            return yield topic.save();
        }
        catch (error) {
            if (error instanceof graphql_1.GraphQLError) {
                throw error;
            }
            else if (error instanceof Error) {
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
    editCard: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("ARGS", args);
        try {
            const curr = yield (context === null || context === void 0 ? void 0 : context.currentUser);
            if (!curr)
                throw new Error("Failed to fetch context");
            const { cardId, newTitle, newPrompts } = args;
            const card = yield Card_1.default.findById(cardId);
            if (!card) {
                throw new graphql_1.GraphQLError("Card not found", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }
            card.title = newTitle;
            card.prompts = newPrompts;
            return yield card.save();
        }
        catch (error) {
            if (error instanceof graphql_1.GraphQLError) {
                throw error;
            }
            else if (error instanceof Error) {
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
    })
};
exports.default = Mutation;
