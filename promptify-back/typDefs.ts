
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

export default typeDefs;