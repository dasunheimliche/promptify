import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://Claussimar:clr87651234@cluster0.ntbmf8a.mongodb.net/promptify?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI)
	.then(()=> console.log("Connected to MongoDB"))
	.catch((error: Error) => console.error("Error connecting to MongoDB", error.message));



