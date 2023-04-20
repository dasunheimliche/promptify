"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cardSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User"
    },
    aiId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Ai"
    },
    topicId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Topic"
    },
    fav: Boolean,
    title: String,
    prompts: [{
            title: String,
            content: String,
        }],
});
cardSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
const Card = mongoose_1.default.model("Card", cardSchema);
exports.default = Card;
