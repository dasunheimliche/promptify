import mongoose from "mongoose";
import { NewUser } from "../types";

const UserSchema = new mongoose.Schema<NewUser>({
  name: String,
  lastname: String,
  email: String,
  password: String,
  username: {
    type: String,
    unique: true,
  },
  allPrompts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ai",
    },
  ],
});

UserSchema.set("toJSON", {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model<NewUser>("User", UserSchema);

export default User;
