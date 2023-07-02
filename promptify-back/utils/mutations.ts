import { GraphQLError } from "graphql";
import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserCollection from "../models/User";
import CardCollection from "../models/Card";
import TopicCollection from "../models/Topic";
import AiCollection from "../models/Ai";

import { createUserArgs, loginArgs, createAiArgs, createTopicArgs, createCardArgs, User, AI, Topic, Card, Token, deleteCardArgs, deleteTopicArgs, Prompt } from "../types";

type StringObj = Record<string, string>

type Context = {
	currentUser: User
} | null

interface editCardArgs {
	cardId: string
	newTitle: string
	newPrompts: Prompt[]
}

const Mutation = {
    createUser: async (_root: any, args: createUserArgs, context: Context) : Promise<Document<User>> => { // eslint-disable-line
		const curr = await context?.currentUser;
		if (!curr) throw new Error("Failed to fetch context");
        
		const { name, lastname, username, password, email } = args;
		const saltRounds = 10;
		const hashPassword = await bcrypt.hash(password, saltRounds);

		const user = new UserCollection({
			name, lastname, username, password:hashPassword, email, allPrompts: []
		});

		return user.save()
			.catch( error => {
				throw new GraphQLError("Creating the user failed", {
					extensions: {
						code: "BAD_USER_INPUT",
						invalidArgs: args,
						error
					}
				});
			});
	},
    createAi: async (_root: any, args: createAiArgs, context: Context) : Promise<Document<AI>> => { // eslint-disable-line
		const curr = await context?.currentUser;
		if (!curr) throw new Error("Failed to fetch context");

		const {userId, ai} = args;

		const newAi = new AiCollection({
			name: ai.name,
			abb: ai.abb,
			fav: false,
			userId: new mongoose.Types.ObjectId(userId),
			topics: []
		});
		const nuevaAi = await newAi.save()
			.catch( error => {
				throw new GraphQLError("Creating the user failed", {
					extensions: {
						code: "BAD_USER_INPUT",
						invalidArgs: args,
						error
					}
				});
			});

		const user : User | null = await UserCollection.findById(userId);

		if (user) {
			user.allPrompts = user.allPrompts?.concat(nuevaAi.id);
			await user.save();
		}

		return nuevaAi;
	}, 
    createTopic: async (_root: any, args: createTopicArgs, context: Context) : Promise<Document<Topic>> => { // eslint-disable-line
		const me = await context?.currentUser;
		if (!me) throw new Error("Failed to fetch context");
        
		const {aiId, topic} = args;
		// const me = await context.currentUser;
		const aIdObject = new mongoose.Types.ObjectId(aiId);

		const newTopic = new TopicCollection({
			userId: me._id,
			aiId: aIdObject,
			name: topic.name,
			fav: false,
			cards: []
		});
		const nuevoTopic : Document<Topic> = await newTopic.save()
			.catch( error => {
				throw new GraphQLError("Creating the user failed", {
					extensions: {
						code: "BAD_USER_INPUT",
						invalidArgs: args,
						error
					}
				});
			});

		const ai : AI | null = await AiCollection.findById(aiId);

		if (ai) {
			ai.topics = ai.topics?.concat(nuevoTopic.id);
			await ai.save();
		}

		return nuevoTopic;
	}, 
    createCard: async (_root: any, args: createCardArgs, context: Context) : Promise<Document<Card>> => { // eslint-disable-line
		const me = await context?.currentUser;
		if (!me) throw new Error("Failed to fetch context");
        
		const {topicId, aiId, card} = args;

		// const me = await context.currentUser;
		const aIdObject = new mongoose.Types.ObjectId(aiId);
		const topicIdObject = new mongoose.Types.ObjectId(topicId);

		const newCard = new CardCollection({
			userId: me._id,
			aiId: aIdObject,
			topicId: topicIdObject,
			title: card.title,
			fav: false,
			prompts: card.prompts
		});

		const nuevaCard  = await newCard.save()
			.catch( error => {
				throw new GraphQLError("Creating the user failed", {
					extensions: {
						code: "BAD_USER_INPUT",
						invalidArgs: args,
						error
					}
				});
			});

		const topic : Topic | null = await TopicCollection.findById(topicId);

		if (topic) {
			topic.cards = topic.cards?.concat(nuevaCard.id);
			await topic.save();
		}
		return nuevaCard;
	},
	login: async(_root:undefined, args: loginArgs) : Promise<Token> => {
		try {
			const user = await UserCollection.findOne({ username: args.username });
        
			if (!user) {
				throw new GraphQLError("User not found", {
					extensions: { code: "BAD_USER_INPUT" },
				});
			}
        
			const passCorrect = await bcrypt.compare(args.password, user.password);
        
			if (!passCorrect) {
				throw new GraphQLError("Wrong credentials", {
					extensions: { code: "BAD_USER_INPUT" },
				});
			}
        
			const userForToken = {
				username: user.username,
				id: user._id,
			};
        
			const token = jwt.sign(userForToken, process.env.SECRET || "");
        
			return { value: token };
		} catch (error) {
			if (error instanceof GraphQLError) {
				throw error;
			} else if (error instanceof Error) {
				throw new GraphQLError(error.message, {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			} else {
				throw new GraphQLError("An unknown error occurred", {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			}
		}
	},
	deleteCard: async(_root:undefined, args: deleteCardArgs, context: Context) : Promise<string> => {
		try {
			const curr = await context?.currentUser;
			if (!curr) throw new Error("Failed to fetch context");

			const { cardId, topicId } = args;
        
			const cardIdObject = new mongoose.Types.ObjectId(cardId);
			const topicIdObject = new mongoose.Types.ObjectId(topicId);
        
			await CardCollection.findByIdAndDelete(cardId);
			await TopicCollection.updateOne(
				{ _id: topicIdObject },
				{ $pull: { cards: cardIdObject } }
			);
        
			return cardId;
		} catch (error) {
			if (error instanceof Error) {
				throw new GraphQLError(error.message, {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			} else {
				throw new GraphQLError("An unknown error occurred", {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			}
		}
	},
	deleteTopic: async(_root:undefined, args: deleteTopicArgs, context: Context) : Promise<string> => {
		try {
			const curr = await context?.currentUser;
			if (!curr) throw new Error("Failed to fetch context");

			const { aiId, topicId } = args;
        
			const aiIdObject = new mongoose.Types.ObjectId(aiId);
			const topicIdObject = new mongoose.Types.ObjectId(topicId);
        
			await CardCollection.deleteMany({ topicId: topicIdObject });
			await TopicCollection.findByIdAndDelete(topicId);
			await AiCollection.updateOne(
				{ _id: aiIdObject },
				{ $pull: { topics: topicIdObject } }
			);
        
			return topicId;
		} catch (error) {
			if (error instanceof Error) {
				throw new GraphQLError(error.message, {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			} else {
				throw new GraphQLError("An unknown error occurred", {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			}
		}
	},
	deleteAi: async(_root: undefined, args: StringObj, context: Context): Promise<string> => {
		try {
			const curr = await context?.currentUser;
			if (!curr) throw new Error("Failed to fetch context");

			const { userId, aiId } = args;
			const userIdObject = new mongoose.Types.ObjectId(userId);
			const aiIdObject = new mongoose.Types.ObjectId(aiId);
        
			await CardCollection.deleteMany({ aiId: aiIdObject });
			await TopicCollection.deleteMany({ aiId: aiIdObject });
			await AiCollection.findByIdAndDelete(aiId);
        
			await UserCollection.updateOne(
				{ _id: userIdObject },
				{ $pull: { allPrompts: aiIdObject } }
			);
        
			return aiId;
		} catch (error) {
			if (error instanceof Error) {
				throw new GraphQLError(error.message, {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			} else {
				throw new GraphQLError("An unknown error occurred", {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			}
		}
	},
	addCardToFavs: async(_root: undefined, args: StringObj, context: Context) : Promise<Document<Card>> => {
		try {
			const curr = await context?.currentUser;
			if (!curr) throw new Error("Failed to fetch context");

			const { cardId } = args;
			const card = await CardCollection.findById(cardId);
			if (!card) {
				throw new GraphQLError("Card not found", {
					extensions: { code: "BAD_USER_INPUT" },
				});
			}
			card.fav = !card.fav;
			await card.save();
			return card;
		} catch (error) {
			if (error instanceof GraphQLError) {
				throw error;
			} else if (error instanceof Error) {
				throw new GraphQLError(error.message, {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			} else {
				throw new GraphQLError("An unknown error occurred", {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			}
		}
	},
	addAiToFavs: async(_root:undefined, args:StringObj, context: Context)=> {
		try {
			const curr = await context?.currentUser;
			if (!curr) throw new Error("Failed to fetch context");

			const { aiId } = args;
			const ai = await AiCollection.findById(aiId);
			if (!ai) {
				throw new GraphQLError("AI not found", {
					extensions: { code: "BAD_USER_INPUT" },
				});
			}
			ai.fav = !ai.fav;
			await ai.save();
			return ai;
		} catch (error) {
			if (error instanceof GraphQLError) {
				throw error;
			} else if (error instanceof Error) {
				throw new GraphQLError(error.message, {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			} else {
				throw new GraphQLError("An unknown error occurred", {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			}
		}
	},
	addTopicToFavs: async(_root: undefined, args: StringObj, context: Context) => {
		try {
			const curr = await context?.currentUser;
			if (!curr) throw new Error("Failed to fetch context");

			const { topicId } = args;
			const topic = await TopicCollection.findById(topicId);
			if (!topic) {
				throw new GraphQLError("Topic not found", {
					extensions: { code: "BAD_USER_INPUT" },
				});
			}
        
			topic.fav = !topic.fav;
			await topic.save();
			return topic;
		} catch (error) {
			if (error instanceof GraphQLError) {
				throw error;
			} else if (error instanceof Error) {
				throw new GraphQLError(error.message, {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			} else {
				throw new GraphQLError("An unknown error occurred", {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			}
		}
	},
	editAi: async(_root: undefined, args: StringObj, context: Context) => {
		try {
			const curr = await context?.currentUser;
			if (!curr) throw new Error("Failed to fetch context");

			const { aiId, newName } = args;
			const ai = await AiCollection.findById(aiId);
			if (!ai) {
				throw new GraphQLError("AI not found", {
					extensions: { code: "BAD_USER_INPUT" },
				});
			}
			ai.name = newName;
        
			return await ai.save();
		} catch (error) {
			if (error instanceof GraphQLError) {
				throw error;
			} else if (error instanceof Error) {
				throw new GraphQLError(error.message, {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			} else {
				throw new GraphQLError("An unknown error occurred", {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			}
		}
	},
	editTopic: async(_root:undefined, args: StringObj, context: Context) => {
		try {
			const curr = await context?.currentUser;
			if (!curr) throw new Error("Failed to fetch context");

			const { topicId, newName } = args;
			const topic = await TopicCollection.findById(topicId);
        
			if (!topic) {
				throw new GraphQLError("Topic not found", {
					extensions: { code: "BAD_USER_INPUT" },
				});
			}
        
			topic.name = newName;
        
			return await topic.save();
		} catch (error) {
			if (error instanceof GraphQLError) {
				throw error;
			} else if (error instanceof Error) {
				throw new GraphQLError(error.message, {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			} else {
				throw new GraphQLError("An unknown error occurred", {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			}
		}
	},
	editCard: async(_root: undefined, args: editCardArgs, context: Context)=> {
		console.log("ARGS", args);
		try {
			const curr = await context?.currentUser;
			if (!curr) throw new Error("Failed to fetch context");

			const { cardId, newTitle, newPrompts } = args;
			const card = await CardCollection.findById(cardId);
        
			if (!card) {
				throw new GraphQLError("Card not found", {
					extensions: { code: "BAD_USER_INPUT" },
				});
			}
        
			card.title = newTitle;
			card.prompts = newPrompts;
        
			return await card.save();
		} catch (error) {
			if (error instanceof GraphQLError) {
				throw error;
			} else if (error instanceof Error) {
				throw new GraphQLError(error.message, {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			} else {
				throw new GraphQLError("An unknown error occurred", {
					extensions: { code: "INTERNAL_SERVER_ERROR" },
				});
			}
		}
	}

};

export default Mutation;