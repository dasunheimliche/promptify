"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AiSchema = new mongoose_1.default.Schema({
    name: String,
    abb: String,
    fav: Boolean,
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User"
    },
    topics: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Topic"
        }]
});
AiSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
const Ai = mongoose_1.default.model("Ai", AiSchema);
exports.default = Ai;
