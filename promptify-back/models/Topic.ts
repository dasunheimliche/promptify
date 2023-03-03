import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
	name: String,
	cards: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Card"
	}]
});

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;