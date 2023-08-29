import mongoose, { Document } from "mongoose";

// USER
export interface User extends Document {
  id: string;
  name: string;
  lastname: string;
  username: string;
  email: string;
  allPrompts: string[] | [];
}
export interface NewUser extends Omit<User, "id"> {
  allPrompts: [];
  password: string;
}

// AI
export interface AI extends Document {
  id: string;
  userId: mongoose.Types.ObjectId;
  fav: boolean;
  name: string;
  abb: string;
  topics: string[] | [];
}
export interface NewAI extends Omit<AI, "id"> {
  topics: [];
}

// TOPIC
export interface Topic extends Document {
  id: string;
  aiId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  fav: boolean;
  name: string;
  cards: Card[] | [];
}
export interface NewTopic extends Omit<Topic, "id"> {
  cards: [];
}

// CARD
export interface Prompt {
  title: string;
  content: string;
}

export interface Card extends Document {
  id: string;
  topicId: mongoose.Types.ObjectId;
  aiId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;

  fav: boolean;

  title: string;
  prompts: Prompt[];
}

export interface NewCard extends Omit<Card, "id"> {} // eslint-disable-line

// ARGS

export interface createUserArgs {
  name: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
}

export interface createCardArgs {
  topicId: string;
  aiId: string;
  card: Card;
}

export interface createTopicArgs {
  userId: string;
  aiId: string;
  topic: Topic;
}

export interface createAiArgs {
  userId: string;
  ai: AI;
}

export interface loginArgs {
  username: string;
  password: string;
}

export interface deleteCardArgs {
  cardId: string;
  topicId: string;
}

export interface deleteTopicArgs {
  aiId: string;
  topicId: string;
}

// TOKEN

export interface Token {
  value: string;
}
