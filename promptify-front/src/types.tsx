export interface Prompt {
    id: number
    title: string
    content: string | Prompt
}
  
export interface Section {
    name: string,
    prompts: Prompt[] | undefined
}
  
export interface AIs {
    name: string,
    abb: string,
    sections: Section[] | undefined
}

export interface User {
    username: string,
    userID: string,
    allPrompts: AIs[] | undefined
}
