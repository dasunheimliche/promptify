import mongoose from "mongoose";
import { NewAI } from "../types";

const AiSchema = new mongoose.Schema<NewAI>({
  name: String,
  abb: String,
  fav: Boolean,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  topics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
    },
  ],
});

AiSchema.set("toJSON", {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Ai = mongoose.model<NewAI>("Ai", AiSchema);

export default Ai;
