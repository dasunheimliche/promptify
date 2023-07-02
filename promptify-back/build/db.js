"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = process.env.MONGODB_URI || "";
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB", error.message));
