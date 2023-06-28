import { GraphQLError } from "graphql";
import mongoose, { Document } from "mongoose";


import UserCollection from "../models/User";
import CardCollection from "../models/Card";
import TopicCollection from "../models/Topic";
import AiCollection from "../models/Ai";

import { User, AI, Topic, Card } from "../types";

type StringObj = Record<string, string>

type Context = {
	currentUser: User
} | null

const Query = {
	hello: () => "Hello world!",
	me: async (_root: undefined, _args: StringObj, context: Context) : Promise<Document<User> | null> => {
		try {
			const curr = context?.currentUser;
			if (!curr) return null;
			return curr;
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
	getInvalidUsernames: async() => {
		try {
			const users = await UserCollection.find({});
			const notAvaliableUsernames = users.map(user => user.username);
			return notAvaliableUsernames;
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
	getAis: async (_root: undefined, args: StringObj, context:Context): Promise<Document<AI>[] | null>=> {
		try {
			const curr = await context?.currentUser;
			if (!curr) return null;
        
			const { meId } = args;
			const ais = await AiCollection.find({
				userId: new mongoose.Types.ObjectId(meId),
			});
			return ais;
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
	getTopics: async (_root:undefined, args:StringObj, context:Context) : Promise<Document<Topic>[] | null> => {
		try {
			const curr = await context?.currentUser;
			if (!curr) return null;
        
			const { mainId } = args;
			const topics = await TopicCollection.find({
				aiId: new mongoose.Types.ObjectId(mainId),
			});
			return topics;
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
	getCards: async (_root:undefined, args:StringObj, context:Context) : Promise<Document<Card>[] | null> => {
		try {
			const curr = await context?.currentUser;
			if (!curr) return null;
        
			const { topicId } = args;
			const cards = await CardCollection.find({
				topicId: new mongoose.Types.ObjectId(topicId),
			});
			return cards;
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
};

export default Query;