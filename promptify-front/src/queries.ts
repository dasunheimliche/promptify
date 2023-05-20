
import { gql } from "@apollo/client"

// MUTATIONS

export const CREATE_USER = gql`
mutation Mutation($name: String!, $lastname: String!, $username: String!, $password: String!, $email: String!) {
    createUser(name: $name, lastname: $lastname, username: $username, password: $password, email: $email) {
        name
        lastname
        username
        password
        email
    }
}
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password)  {
            value
        }
    }
`

export const ADD_AI = gql`
    mutation($userId: String!, $ai: AiInput!) {
        createAi(userId: $userId, ai: $ai) {
            id
            userId
            fav
            name
            abb
            topics
        }
    }
`

export const ADD_TOPIC = gql`
    mutation($aiId: String!, $topic: TopicInput!) {
        createTopic(aiId: $aiId, topic: $topic) {
            id
            aiId
            userId
            fav
            name
            cards
        }
    }
`

export const ADD_CARD = gql`
    mutation($topicId: String!, $aiId: String!, $card: CardInput!) {
        createCard(topicId: $topicId, aiId: $aiId, card: $card) {
            id
            topicId
            aiId
            userId
            title
            fav
            prompts {
                content
                title
            }
        }
    }
`

export const DELETE_CARD = gql`
    mutation($cardId: String!, $topicId: String!) {
        deleteCard(cardId: $cardId, topicId: $topicId)
    }
`

export const DELETE_TOPIC = gql`
    mutation($aiId: String!, $topicId: String!) {
        deleteTopic(aiId: $aiId, topicId: $topicId)
    }
`

export const DELETE_AI = gql`
    mutation($userId: String!, $aiId: String!) {
        deleteAi(userId: $userId, aiId: $aiId)
    }
`

export const ADD_CARD_FAV = gql`
mutation($cardId: String!) {
    addCardToFavs(cardId: $cardId) {
      id
        topicId
        aiId
        userId
        title
        fav
        prompts {
            content
            title
        }
    }
}
`

export const ADD_AI_FAV = gql`
mutation($aiId: String!) {
    addAiToFavs(aiId: $aiId) {
        id
        userId
        name
        abb
        fav
        topics
    }
  }
`

export const ADD_TOPIC_FAV = gql`
mutation($topicId: String!) {
    addTopicToFavs(topicId: $topicId) {
        id
        aiId
        userId
        name
        fav
        cards
    }
  }
`

export const EDIT_AI = gql`
mutation($aiId: String!, $newName: String!) {
    editAi(aiId: $aiId, newName: $newName) {
        id
        userId
        name
        abb
        fav
        topics
    }
}
`

export const EDIT_TOPIC = gql`
mutation($topicId: String!, $newName: String!) {
    editTopic(topicId: $topicId, newName: $newName) {
        id
        aiId
        userId
        name
        fav
        cards
    }
}
`

export const EDIT_CARD = gql`
mutation($cardId: String!, $newTitle: String!, $newPrompts: [PromptInput]!) {
    editCard(cardId: $cardId, newTitle: $newTitle, newPrompts: $newPrompts) {
      id
      topicId
      aiId
      userId
      title
      fav
      prompts {
          content
          title
      }
    }
  }
`

// QUERIES

export const ME = gql`
    query {
        me {
            id
            name
            lastname
            username
            email
            allPrompts
        }
    }
`

export const INVALID_USERNAMES = gql`
    query {
        getInvalidUsernames
    }
`

// export const GET_AIS = gql`
//     query($list: [ID]!) {
//         getAis(list: $list) {
//             id
//             userId
//             name
//             abb
//             fav
//             topics
//         }
//   }
// `

export const GET_AIS = gql`
    query($meId: ID!) {
        getAis(meId: $meId) {
            id
            userId
            name
            abb
            fav
            topics
        }
  }
`

// export const GET_TOPICS = gql`
// query($list: [ID]!) {
//     getTopics(list: $list) {
//         id
//         aiId
//         userId
//         name
//         fav
//         cards
//     }
// }
// `

export const GET_TOPICS = gql`
query($mainId: ID!) {
    getTopics(mainId: $mainId) {
        id
        aiId
        userId
        name
        fav
        cards
    }
}
`

// export const GET_CARDS = gql`
// query($list: [ID]!) {
//     getCards(list: $list) {
//         id
//         topicId
//         aiId
//         userId
//         title
//         fav
//         prompts {
//             content
//             title
//         }
//     }
//   }
// `
export const GET_CARDS = gql`
query($topicId: ID!) {
    getCards(topicId: $topicId) {
        id
        topicId
        aiId
        userId
        title
        fav
        prompts {
            content
            title
        }
    }
  }
`
