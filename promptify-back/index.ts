import cors from "cors";
import typeDefs from "./typDefs";

import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";

import { json } from "body-parser";
import express from "express";
import http from "http";

import dotenv from "dotenv";
dotenv.config();

import "./db";

import { getCurrentUser } from "./utils/context";
import Query from "./utils/queries";
import Mutation from "./utils/mutations";


/* GRAPHQL DEFINITIONS */

const resolvers = {
	Query,
	Mutation
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
					currentUser: await getCurrentUser(req)
				})
			}),
		);
		
		httpServer.listen({ port: 4000 }, ()=> {
			console.log("Server connected to port: 4000");
		});
	});


