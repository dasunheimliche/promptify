import { ADD_CARD } from '@/queries'
import { useState, Dispatch } from 'react'
import { Topic, Card } from '../types'
import { useMutation } from '@apollo/client';

interface AddPromptProps {
    setShowMenu: Dispatch<string>
    topic: Topic | undefined
    cardList: Card[] | undefined
    setCardList: Dispatch<Card[]>
}

interface addCardData {
    createCard: Card
}

interface promptVariables {
    title: string
    content: string
}

interface addCardVariables {
    topicId: string
    aiId: string
    card: {
        title: string
        prompts: promptVariables[]
    }
}

const AddPrompt = ({cardList, topic, setCardList, setShowMenu} : AddPromptProps)=> {

    const [title, setName] = useState<string>("")
    const [content, setContent] = useState<string>("")

    const [ createCard, { error, data } ] = useMutation<addCardData, addCardVariables>(ADD_CARD)

    const closePanel = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=> {
        e.preventDefault()
        setShowMenu("none")
    }

    const addPrompt = async (e: React.FormEvent<HTMLDivElement>)=> {
        e.preventDefault()
        if (!topic) {
            return
        }
        const variables = {topicId: topic.id, aiId: topic.aiId, card: {
            title,
            prompts: [{
                title: "",
                content

            }]
        }}

        const newCard = await createCard({variables: variables})

        if (!newCard.data) {
            return
        }

        let copied

        if (!cardList) {
            copied = [newCard.data.createCard]
        } else {
            copied = [...cardList, newCard.data.createCard]

        }

        if (!copied) return

        setCardList(copied)
    }

    return (
        <div className="menu-panel" onSubmit={addPrompt}>
            <div className="mp-header">
                <div className="mp-header-title">Add a Prompt</div>
                <div className="mp-header-close p" onClick={closePanel}>x</div>
            </div>
            <form action="" className="menu-panel-form ">
                <label className="menu-title">{"Title"}</label>
                <input type="text" placeholder="title" onChange={e=> setName(e.target.value)}/>

                <label className="menu-title">{"Prompt"}</label>
                <textarea value={content} placeholder="Write your prompt" onChange={e=> setContent(e.target.value)}/>

                <div className="menu-buttons">
                    <button type="submit">Add Prompt</button>
                </div>
            </form>
        </div>
    )
}

export default AddPrompt