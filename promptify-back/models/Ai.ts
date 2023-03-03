import mongoose from "mongoose";

const AiSchema = new mongoose.Schema({
	name: String,
	abb: String,
	topics: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Topic"
	}]
});

const Ai = mongoose.model("Ai", AiSchema);

export default Ai;