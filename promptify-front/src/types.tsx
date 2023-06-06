export interface User {
    id: string
    name: string
    lastname: string
    username: string
    email: string
    allPrompts: string[] | undefined
    __typename: string
}

export interface AI {
    id: string
    userId: string
    name: string
    abb: string
    fav: boolean
    topics: string[] | undefined
    __typename: string
}

export interface Topic {
    id: string
    aiId: string
    userId: string
    fav: boolean
    name: string
    cards: string[] | undefined
    __typename: string
}

export interface Prompt {
    title: string
    content: string
    __typename?: string
}

export interface Card {
    id: string
    topicId: string
    aiId: string
    userId: string

    title: string

    fav: boolean

    prompts: Prompt[]
    __typename: string
}

export interface Token {
	value: string
}

export interface Mains {
    main: AI | undefined
    topic: Topic | undefined
    currCard: Card | undefined
    profile: boolean
}

export interface Visibility {
    showMenu:"none" | "add ai" | "add prompt" | "add stack"
    showSS:boolean
    showPS:boolean
}