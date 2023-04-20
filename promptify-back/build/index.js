"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const server_1 = require("@apollo/server");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const express4_1 = require("@apollo/server/express4");
const body_parser_1 = require("body-parser");
// import { startStandaloneServer } from "@apollo/server/standalone";
const graphql_1 = require("graphql");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./db");
const User_1 = __importDefault(require("./models/User"));
const Card_1 = __importDefault(require("./models/Card"));
const Topic_1 = __importDefault(require("./models/Topic"));
const Ai_1 = __importDefault(require("./models/Ai"));
const mongoose_1 = __importDefault(require("mongoose"));
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
		getAis(list: [ID]!): [AI]
		getTopics(list: [ID]!): [Topic]
		getCards(list: [ID]!): [Card]
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
        me: (_root, _args, context) => {
            // ! no devolver context.currentUser, sino context.currentUser()
            return context.currentUser();
        },
        getInvalidUsernames: () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield User_1.default.find({});
            const validNames = users.map(user => user.username);
            return validNames;
        }),
        getAis: (_root, args, _context) => __awaiter(void 0, void 0, void 0, function* () {
            const curr = yield _context.currentUser();
            if (!curr)
                return null;
            const { list } = args;
            const idList = list.map((str) => new mongoose_1.default.Types.ObjectId(str));
            const ais = yield Ai_1.default.find({ _id: { $in: idList } });
            return ais;
        }),
        getTopics: (_root, args, _context) => __awaiter(void 0, void 0, void 0, function* () {
            const curr = yield _context.currentUser();
            if (!curr)
                return null;
            const { list } = args;
            const idList = list.map((str) => new mongoose_1.default.Types.ObjectId(str));
            const topics = yield Topic_1.default.find({ _id: { $in: idList } });
            return topics;
        }),
        getCards: (_root, args, _context) => __awaiter(void 0, void 0, void 0, function* () {
            const curr = yield _context.currentUser();
            if (!curr)
                return null;
            const { list } = args;
            const idList = list.map((str) => new mongoose_1.default.Types.ObjectId(str));
            const cards = yield Card_1.default.find({ _id: { $in: idList } });
            return cards;
        })
    },
    Mutation: {
        createUser: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { name, lastname, username, password, email } = args;
            const saltRounds = 10;
            const hashPassword = yield bcrypt_1.default.hash(password, saltRounds);
            const user = new User_1.default({
                name, lastname, username, password: hashPassword, email, allPrompts: []
            });
            return user.save()
                .catch(error => {
                throw new graphql_1.GraphQLError("Creating the user failed", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args,
                        error
                    }
                });
            });
        }),
        createAi: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const { userId, ai } = args;
            const newAi = new Ai_1.default({
                name: ai.name,
                abb: ai.abb,
                fav: false,
                userId: new mongoose_1.default.Types.ObjectId(userId),
                topics: []
            });
            const nuevaAi = yield newAi.save()
                .catch(error => {
                throw new graphql_1.GraphQLError("Creating the user failed", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args,
                        error
                    }
                });
            });
            const user = yield User_1.default.findById(userId);
            if (user) {
                user.allPrompts = (_a = user.allPrompts) === null || _a === void 0 ? void 0 : _a.concat(nuevaAi.id);
                yield user.save();
            }
            return nuevaAi;
        }),
        createTopic: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const { aiId, topic } = args;
            const me = yield context.currentUser();
            const aIdObject = new mongoose_1.default.Types.ObjectId(aiId);
            const newTopic = new Topic_1.default({
                userId: me._id,
                aiId: aIdObject,
                name: topic.name,
                fav: false,
                cards: []
            });
            const nuevoTopic = yield newTopic.save()
                .catch(error => {
                throw new graphql_1.GraphQLError("Creating the user failed", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args,
                        error
                    }
                });
            });
            const ai = yield Ai_1.default.findById(aiId);
            if (ai) {
                ai.topics = (_b = ai.topics) === null || _b === void 0 ? void 0 : _b.concat(nuevoTopic.id);
                yield ai.save();
            }
            return nuevoTopic;
        }),
        createCard: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            const { topicId, aiId, card } = args;
            const me = yield context.currentUser();
            const aIdObject = new mongoose_1.default.Types.ObjectId(aiId);
            const topicIdObject = new mongoose_1.default.Types.ObjectId(topicId);
            const newCard = new Card_1.default({
                userId: me._id,
                aiId: aIdObject,
                topicId: topicIdObject,
                title: card.title,
                fav: false,
                prompts: card.prompts
            });
            const nuevaCard = yield newCard.save()
                .catch(error => {
                throw new graphql_1.GraphQLError("Creating the user failed", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args,
                        error
                    }
                });
            });
            const topic = yield Topic_1.default.findById(topicId);
            if (topic) {
                topic.cards = (_c = topic.cards) === null || _c === void 0 ? void 0 : _c.concat(nuevaCard.id);
                yield topic.save();
            }
            return nuevaCard;
        }),
        login: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ username: args.username });
            const passCorrect = user === null ? false : yield bcrypt_1.default.compare(args.password, user.password); // eslint-disable-line
            if (!(user && passCorrect)) {
                throw new graphql_1.GraphQLError("wrong credentials", {
                    extensions: {
                        code: "BAD_USER_INPUT"
                    }
                });
            }
            const userForToken = {
                username: user.username,
                id: user._id
            };
            const token = jsonwebtoken_1.default.sign(userForToken, process.env.SECRET || "");
            return { value: token };
        }),
        deleteCard: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { cardId, topicId } = args;
            const cardIdObject = new mongoose_1.default.Types.ObjectId(cardId);
            const topicIdObject = new mongoose_1.default.Types.ObjectId(topicId);
            yield Card_1.default.findByIdAndDelete(cardId);
            yield Topic_1.default.updateOne({ _id: topicIdObject }, { $pull: { cards: cardIdObject } });
            return true;
        }),
        deleteTopic: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { aiId, topicId } = args;
            const topic = yield Topic_1.default.findById(topicId);
            if (!topic) {
                return false;
            }
            const aiIdObject = new mongoose_1.default.Types.ObjectId(aiId);
            const topicIdObject = new mongoose_1.default.Types.ObjectId(topicId);
            yield Card_1.default.deleteMany({ topicId: topicIdObject });
            yield Topic_1.default.findByIdAndDelete(topicId);
            yield Ai_1.default.updateOne({ _id: aiIdObject }, { $pull: { topics: topicIdObject } });
            return true;
        }),
        deleteAi: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { userId, aiId } = args;
            const userIdObject = new mongoose_1.default.Types.ObjectId(userId);
            const aiIdObject = new mongoose_1.default.Types.ObjectId(aiId);
            yield Card_1.default.deleteMany({ aiId: aiIdObject });
            yield Topic_1.default.deleteMany({ aiId: aiIdObject });
            yield Ai_1.default.findByIdAndDelete(aiId);
            yield User_1.default.updateOne({ _id: userIdObject }, { $pull: { allPrompts: aiIdObject } });
            return true;
        }),
        addCardToFavs: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { cardId } = args;
            const card = yield Card_1.default.findById(cardId);
            if (!card) {
                return;
            }
            card.fav = !card.fav;
            yield card.save();
            return card;
        }),
        addAiToFavs: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { aiId } = args;
            const ai = yield Ai_1.default.findById(aiId);
            if (!ai) {
                return;
            }
            ai.fav = !ai.fav;
            yield ai.save();
            return ai;
        }),
        addTopicToFavs: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { topicId } = args;
            const topic = yield Topic_1.default.findById(topicId);
            if (!topic) {
                return;
            }
            topic.fav = !topic.fav;
            yield topic.save();
            return topic;
        }),
        editAi: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { aiId, newName } = args;
            const ai = yield Ai_1.default.findById(aiId);
            if (!ai) {
                return;
            }
            ai.name = newName;
            return yield ai.save();
        }),
        editTopic: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { topicId, newName } = args;
            const topic = yield Topic_1.default.findById(topicId);
            if (!topic) {
                return;
            }
            topic.name = newName;
            return yield topic.save();
        }),
        editCard: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { cardId, newTitle, newPrompts } = args;
            const card = yield Card_1.default.findById(cardId);
            if (!card) {
                return;
            }
            card.title = newTitle;
            card.prompts = newPrompts;
            return yield card.save();
        })
    }
};
/* CREATING THE SERVER */
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const server = new server_1.ApolloServer({
    typeDefs,
    resolvers,
    plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })]
});
server.start()
    .then(() => {
    app.use((0, cors_1.default)({ origin: "*" }), (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(server, {
        context: ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                currentUser: () => __awaiter(void 0, void 0, void 0, function* () {
                    if (!req) {
                        return null;
                    }
                    // ! ALERTA: debo enviar el token sin comillas desde apollo-server sino llegaran con comillas extras y el startsWith no va a funcionar
                    const auth = req.headers.authorization;
                    if (!auth) {
                        return null;
                    }
                    if (auth && auth.startsWith("Bearer ")) {
                        const decodedToken = jsonwebtoken_1.default.verify(auth.substring(7), process.env.SECRET || "");
                        const current = yield User_1.default.findById(decodedToken.id);
                        return current;
                    }
                    return null;
                }),
            });
        })
    }));
    httpServer.listen({ port: 4000 }, () => {
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
