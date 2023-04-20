import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const MONGODB_URI : string = process.env.MONGODB_URI || "";

mongoose.connect(MONGODB_URI)
	.then(()=> console.log("Connected to MongoDB"))
	.catch((error: Error) => console.error("Error connecting to MongoDB", error.message));



