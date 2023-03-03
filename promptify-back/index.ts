import { ApolloServer, gql } from "apollo-server";
import "./db";

/* GRAPHQL DEFINITIONS */

const typeDefs = gql`
	type User {
		id: ID!

		name: String!
		lastname: String!
		email: String!

		usename: String!
		allPrompts: [Ai]
	}

	type Ai {
		id: ID!

		name: String!
		abb: String!
		topics: [Topic]
	}

	type Topic {
		id: ID!

		name: String!
		cards: [Card]
	}

	type Card {
		id: ID!

		title: String!
		prompts: [Prompt]!
	}

	type Prompt {
		title: String!
		content: String!
	}

	type Query {
    	hello: String
	}
`;

const resolvers = {
	Query: {
		hello: () => "Hello world!",
	},
};

/* CREATING THE SERVER */

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	console.log(`Server ready at ${url}`);
});