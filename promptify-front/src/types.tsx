export interface Prompt {
    id: number
    title: string
    content: string 
}

export interface Card {
    title: string
    prompts: Prompt[]

}
  
export interface Topic {
    name: string
    cards: Card[]
}
  
export interface AI {
    name: string
    abb: string
    topics: Topic[] | undefined
}

export interface User {
    username: string
    userID: string
    allPrompts: AI[] | undefined
}
