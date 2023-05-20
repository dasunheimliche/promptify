import cors from "cors";

import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { json } from "body-parser";
// import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";
import express from "express";
import http from "http";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import "./db";

import { Document } from "mongoose";

import UserCollection from "./models/User";
import CardCollection from "./models/Card";
import TopicCollection from "./models/Topic";
import AiCollection from "./models/Ai";

import mongoose from "mongoose";

import { createUserArgs, loginArgs, createAiArgs, createTopicArgs, createCardArgs, User, AI, Topic, Card, Token, deleteCardArgs, deleteTopicArgs } from "./types";

/* TYPES */ 

interface JwtPayload {
	username: string
	id: string
	iat: number
}

/* GRAPHQL DEFINITIONS */

const typeDefs = `

	# INPUT TYPES _ _ _ _ _ _ _ _ _

	input AiInput {
		name: String!
		abb: String!
	}
	input TopicInput {
		name: String!
	}
	input CardInput {
		title: String!
		prompts: [PromptInput]!
	}
	input  PromptInput {
		title: String!
		content: String!
	}

	# TYPES _ _ _ _ _ _ _ _ _ _ _ _ _

	type User {
		id: ID!
		name: String!
		lastname: String!
		email: String!
		username: String!
		password: String!
		allPrompts: [ID]
	}

	type AI {
		id: ID!
		userId: ID!
		fav:Boolean!
		name: String!
		abb: String!
		topics: [ID]
	}

	type Topic {
		id: ID!
		aiId: ID!
		userId: ID!
		fav: Boolean!
		name: String!
		cards: [ID]
	}

	type Card {
		id: ID!
		topicId: ID!
		aiId: ID!
		userId: ID!
		
		fav: Boolean!
		title: String!
		prompts: [Prompt]!
	}

	type Token {
		value: String!
	}

	type Prompt {
		title: String!
		content: String!
	}

	# QUERY TYPES _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

	type Query {
    	hello: String
		me: User
		getInvalidUsernames: [String]!
		# getAis(list: [ID]!): [AI]
		getAis(meId: ID!): [AI]
		# getTopics(list: [ID]!): [Topic]
		getTopics(mainId: ID!): [Topic]
		# getCards(list: [ID]!): [Card]
		getCards(topicId: ID!): [Card]
	}

	# MUTATIONS _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

	type Mutation {
		createUser (
			name: String!
			lastname: String!
			username: String!
			password: String!
			email: String!
		) : User

		createAi (
			userId: String!
			ai: AiInput!
		) : AI

		createTopic (
			aiId: String!
			topic: TopicInput!
		) : Topic

		createCard (
			topicId: String!
			aiId: String!

			card: CardInput!
		) : Card

		login (
			username: String!
			password: String!
		) : Token

		deleteCard (
			cardId: String!
			topicId: String!
		) : Boolean!

		deleteTopic (
			aiId: String!
			topicId: String!
		) : Boolean!

		deleteAi (
			userId: String!
			aiId: String!
		) : Boolean!

		addCardToFavs (
			cardId: String!
		) : Card

		addAiToFavs (
			aiId: String!
		) : AI

		addTopicToFavs (
			topicId: String!
		) : Topic

		editAi (
			aiId: String!
			newName: String!
		) : AI

		editTopic (
			topicId: String!
			newName: String!
		) : Topic

		editCard (
			cardId: String!
			newTitle: String!
			newPrompts: [PromptInput]!
		) : Card
	}
`;

const resolvers = {
	Query: {
		hello: () => "Hello world!",
		me: (_root: any, _args: any, context: any) => { // eslint-disable-line
			// ! no devolver context.currentUser, sino context.currentUser()
			return context.currentUser();
		},
		getInvalidUsernames: async() => {
			const users = await UserCollection.find({});
			const validNames = users.map(user => user.username);

			return validNames;
		},
		getAis: async (_root: any, args: any, _context:any)=> { // eslint-disable-line

			const curr = await _context.currentUser();

			if (!curr) return null;

			// const { list } = args;
			// const idList = list.map((str: string) => new mongoose.Types.ObjectId(str));

			// const ais = await AiCollection.find({_id: {$in: idList}});

			// return ais;

			const {meId} = args;
			console.log("AI ID", meId);
			const ais = await AiCollection.find({userId: new mongoose.Types.ObjectId(meId)});
			return ais;
		},
		getTopics: async (_root:any, args:any, _context:any) => { // eslint-disable-line
			const curr = await _context.currentUser();
			if (!curr) return null;

			// const { list } = args;
			// const idList = list.map((str: string) => new mongoose.Types.ObjectId(str));

			// const topics = await TopicCollection.find({_id: {$in: idList}});

			// return topics;

			const {mainId} = args;
			const topics = await TopicCollection.find({aiId: new mongoose.Types.ObjectId(mainId)});
			return topics;

		},
		getCards: async (_root:any, args:any, _context:any) => { // eslint-disable-line
			const curr = await _context.currentUser();
			if (!curr) return null;

			// const { list } = args;
			// const idList = list.map((str: string) => new mongoose.Types.ObjectId(str));

			// const cards = await CardCollection.find({_id: {$in: idList}});

			// return cards;

			const { topicId } = args;
			const cards = await CardCollection.find({topicId: new mongoose.Types.ObjectId(topicId)});
			return cards;
		}
	},
	Mutation: {
		createUser: async (_root: any, args: createUserArgs) : Promise<Document<User>> => { // eslint-disable-line
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
		createAi: async (_root: any, args: createAiArgs) : Promise<Document<AI>> => { // eslint-disable-line
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
		createTopic: async (_root: any, args: createTopicArgs, context: any) : Promise<Document<Topic>> => { // eslint-disable-line
			const {aiId, topic} = args;
			const me = await context.currentUser();
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
		createCard: async (_root: any, args: createCardArgs, context: any) : Promise<Document<Card>> => { // eslint-disable-line
			const {topicId, aiId, card} = args;

			const me = await context.currentUser();
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
		login: async(_root:any, args: loginArgs) : Promise<Token> => { // eslint-disable-line

			const user = await UserCollection.findOne({username: args.username});

			const passCorrect = user === null? false : await bcrypt.compare(args.password, user.password!); // eslint-disable-line

			if (!(user && passCorrect)) {
				throw new GraphQLError("wrong credentials", {
					extensions: {
						code: "BAD_USER_INPUT"
					}
				});
			}

			const userForToken = {
				username: user.username,
				id: user._id
			};

			const token = jwt.sign(userForToken, process.env.SECRET || "");

			return {value: token};
		},
		deleteCard: async(_root:any, args: deleteCardArgs) => { // eslint-disable-line
			const { cardId, topicId } = args;

			const cardIdObject = new mongoose.Types.ObjectId(cardId);
			const topicIdObject = new mongoose.Types.ObjectId(topicId);

			await CardCollection.findByIdAndDelete(cardId);
			await TopicCollection.updateOne({ _id: topicIdObject }, { $pull: { cards: cardIdObject} });

			return true;

		},
		deleteTopic: async(_root:any, args: deleteTopicArgs)=> { // eslint-disable-line
			const { aiId, topicId } = args;
			const topic = await TopicCollection.findById(topicId);

			if (!topic) {
				return false;
			}

			const aiIdObject = new mongoose.Types.ObjectId(aiId);
			const topicIdObject = new mongoose.Types.ObjectId(topicId);

			await CardCollection.deleteMany({topicId: topicIdObject});
			await TopicCollection.findByIdAndDelete(topicId);
			await AiCollection.updateOne({ _id: aiIdObject }, { $pull: { topics: topicIdObject} });

			return true;
		},
		deleteAi: async(_root: any, args: any) => {
			const { userId, aiId } = args;
			const userIdObject = new mongoose.Types.ObjectId(userId);
			const aiIdObject = new mongoose.Types.ObjectId(aiId);

			await CardCollection.deleteMany({aiId: aiIdObject});
			await TopicCollection.deleteMany({aiId: aiIdObject});
			await AiCollection.findByIdAndDelete(aiId);

			await UserCollection.updateOne({ _id: userIdObject }, { $pull: { allPrompts: aiIdObject} });

			return true;
		},
		addCardToFavs: async(_root: any, args: any)=> {
			const { cardId } = args;
			const card = await CardCollection.findById(cardId);
			if (!card) {
				return;
			}
			card.fav = !card.fav;
			await card.save();
			return card;
		},
		addAiToFavs: async(_root:any, args:any)=> {
			const { aiId } = args;
			const ai = await AiCollection.findById(aiId);
			if (!ai) {
				return;
			}
			ai.fav = !ai.fav;
			await ai.save();
			return ai;
		},
		addTopicToFavs: async(_root: any, args: any) => {
			const { topicId } = args;
			const topic = await TopicCollection.findById(topicId);
			if (!topic) {
				return;
			}

			topic.fav = !topic.fav;
			await topic.save();
			return topic;
		},
		editAi: async(_root: any, args: any) => {

			const { aiId, newName } = args;
			const ai = await AiCollection.findById(aiId);
			if (!ai) {
				return;
			}
			ai.name = newName;

			return await ai.save();
		},
		editTopic: async(_root:any, args: any) => {

			const {topicId, newName} = args;
			const topic = await TopicCollection.findById(topicId);

			if(!topic) {
				return;
			}

			topic.name = newName;

			return await topic.save();
		},
		editCard: async(_root: any, args: any)=> {
			const { cardId ,newTitle, newPrompts } = args;
			const card = await CardCollection.findById(cardId);

			if (!card) {
				return;
			}

			card.title = newTitle;
			card.prompts = newPrompts;

			return await card.save();
		}

	}
};

/* CREATING THE SERVER */

const app = express();
const httpServer = http.createServer(app);
  

const server = new ApolloServer({ 
	typeDefs, 
	resolvers,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});


server.start()
	.then(()=>{
		app.use(
			cors<cors.CorsRequest>({ origin: "*" }),
			json(),
			expressMiddleware(server, {
				context: async ({req }) => ({
					currentUser: async () => {
						if (!req) {
							return null;
						}
						// ! ALERTA: debo enviar el token sin comillas desde apollo-server sino llegaran con comillas extras y el startsWith no va a funcionar
						const auth = req.headers.authorization;
						if (!auth) {
							return null;
						}
			
						if (auth && auth.startsWith("Bearer ")) {
			
							const decodedToken = jwt.verify(
								auth.substring(7), process.env.SECRET || ""
							) as JwtPayload;
			
							const current = await UserCollection.findById(decodedToken.id);
							return current;
						}
						return null;
					},
				})
			}),
		);
		
		httpServer.listen({ port: 4000 }, ()=> {
			console.log("Server connected to port: 4000");
		});
	});




// app.use(
// 	cors<cors.CorsRequest>({ origin: ["*"] }),
// 	expressMiddleware(server, {
// 		context: async ({req }) => ({
// 			currentUser: async () => {
// 				if (!req) {
// 					return null;
// 				}
// 				// ! ALERTA: debo enviar el token sin comillas desde apollo-server sino llegaran con comillas extras y el startsWith no va a funcionar
// 				const auth = req.headers.authorization;
// 				if (!auth) {
// 					return null;
// 				}
	
// 				if (auth && auth.startsWith("Bearer ")) {
	
// 					const decodedToken = jwt.verify(
// 						auth.substring(7), process.env.SECRET || ""
// 					) as JwtPayload;
	
// 					const current = await UserCollection.findById(decodedToken.id);
// 					return current;
// 				}
// 				return null;
// 			},
// 		})
// 	}),
// );

// httpServer.listen({ port: 4000 }, ()=> {
// 	console.log("Server connected to port: 4000");
// });



// startStandaloneServer(server, {
// 	context: async ({req }) => ({
// 		currentUser: async () => {
// 			if (!req) {
// 				return null;
// 			}
// 			// ! ALERTA: debo enviar el token sin comillas desde apollo-server sino llegaran con comillas extras y el startsWith no va a funcionar
// 			const auth = req.headers.authorization;
// 			if (!auth) {
// 				return null;
// 			}

// 			if (auth && auth.startsWith("Bearer ")) {

// 				const decodedToken = jwt.verify(
// 					auth.substring(7), process.env.SECRET || ""
// 				) as JwtPayload;

// 				const current = await UserCollection.findById(decodedToken.id);
// 				return current;
// 			}
// 			return null;
// 		},
// 	}),
// 	listen: { port: 4000 },
// }).then(({url})=>console.log("Server connected to:", url));




