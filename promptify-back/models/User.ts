import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	name: String,
	lastname: String,
	email: String,
	username: {
		type: String,
		unique: true
	},
	allPrompts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Ai"
	}]
});

const User = mongoose.model("User", UserSchema);

export default User;