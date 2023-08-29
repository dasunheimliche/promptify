import mongoose from "mongoose";
import { NewCard } from "../types";

const cardSchema = new mongoose.Schema<NewCard>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  aiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ai",
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
  },
  fav: Boolean,
  title: String,
  prompts: [
    {
      title: String,
      content: String,
    },
  ],
});

cardSchema.set("toJSON", {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Card = mongoose.model<NewCard>("Card", cardSchema);

export default Card;
