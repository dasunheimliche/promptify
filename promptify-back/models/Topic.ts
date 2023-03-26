import mongoose from "mongoose";
import { NewTopic } from "../types";

const topicSchema = new mongoose.Schema<NewTopic>({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	aiId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Ai"
	},
	name: String,
	fav: Boolean,
	cards: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Card"
	}]
});

topicSchema.set("toJSON", {
	transform: (_document: any, returnedObject: any) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

const Topic = mongoose.model<NewTopic>("Topic", topicSchema);

export default Topic;