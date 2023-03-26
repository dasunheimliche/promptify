import { useState, Dispatch } from 'react'
import { Prompt, Topic, Card } from '../types'
import { useMutation } from '@apollo/client';
import { ADD_CARD } from '@/queries'

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
    card: {
        title: string
        prompts: promptVariables[]
    }
}

const AddStack = ({cardList, setCardList, topic, setShowMenu} : AddPromptProps)=> {

    const [stackTitle, setStackTitle] = useState<string>("")
    const [count, setCount] = useState<number>(0)

    const [stack, setStack] = useState<promptVariables[] | undefined>([])
    const [promptTitle, setPromptTitle] = useState<string>("")
    const [promptContent, setPromptContent] = useState<string>("")

    const [ createCard, { error, data } ] = useMutation<addCardData, addCardVariables>(ADD_CARD)

    // EVENT HANDLERS
    const closePanel = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=> {
        e.preventDefault()
        setShowMenu("none")
    }

    const addToStack = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=> {
        e.preventDefault()
        setCount(count + 1)
        let newPrompt = {title: promptTitle, content: promptContent}
        if (stack) {
            setStack( [...stack, newPrompt])
        } else {
            setStack([newPrompt])
        }
        setPromptTitle("")
        setPromptContent("")
    }

    const addPrompt = async(e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault()

        if (!topic || !stack || !cardList ) {
            return
        }

        const variables = {topicId: topic.id, aiId: topic.aiId, card: {
            title: stackTitle,
            prompts: stack
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
                <div className="mp-header-title">Add a Stack</div>
                <div className="mp-header-close p" onClick={closePanel}>x</div>
            </div>
            <form action="" className="menu-panel-form ">
                <label className="menu-title">{"Stack Title"}</label>
                <input type="text" placeholder=" stack title" onChange={ e=> setStackTitle(e.target.value)}/>

                <div className='mp-stack-header'>
                    <label className="menu-title">{`Prompt Stack: ${count}`}</label>
                    <button onClick={addToStack}>+ Add to Stack</button>
                </div>
                <input value={promptTitle} type="text" placeholder="prompt title" onChange={e=> setPromptTitle(e.target.value)}/>
                <textarea value={promptContent} placeholder="Write your prompt" onChange={e=> setPromptContent(e.target.value)}/>

                <div className="menu-buttons">
                    <button type="submit">Add Prompt</button>
                </div>
            </form>
        </div>
    )
}

export default AddStack