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
const typDefs_1 = __importDefault(require("./typDefs"));
const server_1 = require("@apollo/server");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const express4_1 = require("@apollo/server/express4");
const body_parser_1 = require("body-parser");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./db");
const context_1 = require("./utils/context");
const queries_1 = __importDefault(require("./utils/queries"));
const mutations_1 = __importDefault(require("./utils/mutations"));
/* GRAPHQL DEFINITIONS */
const resolvers = {
    Query: queries_1.default,
    Mutation: mutations_1.default
};
/* CREATING THE SERVER */
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const server = new server_1.ApolloServer({
    typeDefs: typDefs_1.default,
    resolvers,
    plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })]
});
server.start()
    .then(() => {
    app.use((0, cors_1.default)({ origin: "*" }), (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(server, {
        context: ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                currentUser: yield (0, context_1.getCurrentUser)(req)
            });
        })
    }));
    httpServer.listen({ port: 4000 }, () => {
        console.log("Server connected to port: 4000");
    });
});
