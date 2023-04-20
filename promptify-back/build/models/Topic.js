"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const topicSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User"
    },
    aiId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Ai"
    },
    name: String,
    fav: Boolean,
    cards: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Card"
        }]
});
topicSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
const Topic = mongoose_1.default.model("Topic", topicSchema);
exports.default = Topic;
