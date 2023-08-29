// ENTITIES

export interface User {
  id: string;
  name: string;
  lastname: string;
  username: string;
  email: string;
  allPrompts: string[] | undefined;
  __typename: string;
}

export interface AI {
  id: string;
  userId: string;
  name: string;
  abb: string;
  fav: boolean;
  topics: string[] | undefined;
  __typename: string;
}

export interface Topic {
  id: string;
  aiId: string;
  userId: string;
  fav: boolean;
  name: string;
  cards: string[] | undefined;
  __typename: string;
}

export interface Prompt {
  title: string;
  content: string;
  __typename?: string;
}

export interface Card {
  id: string;
  topicId: string;
  aiId: string;
  userId: string;

  title: string;

  fav: boolean;

  prompts: Prompt[];
  __typename: string;
}

export interface Token {
  value: string;
}

// CURRENT ITEMS

export interface Mains {
  main: { id: string } | undefined;
  topic: { id: string; aiId: string } | undefined;
  currCard: { id: string; aiId: string; topicId: string } | undefined;
  profile: boolean;
}

// VISIBILITY

export interface Visibility {
  showMenu: "none" | "add ai" | "add prompt" | "add stack";
  showSS: boolean;
  showPS: boolean;
}

// GRAPHQL DATA

export interface meData {
  me: User;
}

export interface aiListData {
  getAis: AI[];
}

export interface aiListVariables {
  meId: string | undefined;
}

export interface topicListData {
  getTopics: Topic[];
}

export interface topicListVariables {
  mainId: string | undefined;
}

export interface getCardsData {
  getCards: Card[];
}

export interface getCardsVariables {
  topicId: string | undefined;
}
