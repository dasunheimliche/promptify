import { useState, Dispatch } from 'react'

import { Topic, Card, AI } from '../types'

import { useMutation } from '@apollo/client';
import { ADD_CARD } from '@/queries'

import style from '../styles/popups.module.css'

interface Mains {
    main: AI | undefined
    topic: Topic | undefined
    currCard: Card | undefined
  }

interface AddPromptProps {
    setShowMenu: Dispatch<string>
    topic: Topic | undefined
    cardList: Card[] | undefined
    setCardList: Dispatch<Card[]>
    setTopic: Dispatch<Topic>
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

const AddStack = ({cardList, setCardList, topic, setShowMenu, setTopic} : AddPromptProps)=> {

    const [stackTitle, setStackTitle] = useState<string>("")
    const [count, setCount] = useState<number>(0)

    const [stack, setStack] = useState<promptVariables[] | undefined>([])
    const [promptTitle, setPromptTitle] = useState<string>("")
    const [promptContent, setPromptContent] = useState<string>("")

    const [ createCard, { loading } ] = useMutation<addCardData, addCardVariables>(ADD_CARD)

    // EVENT HANDLERS
    const closePanel = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=> {
        e.preventDefault()
        setShowMenu("none")
    }

    const addToStack = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const newPrompt = { title: promptTitle, content: promptContent };
        const updatedStack = stack ? [...stack, newPrompt] : [newPrompt];
        
        setCount(count + 1);
        setStack(updatedStack);
        setPromptTitle("");
        setPromptContent("");
    };

    const addPrompt = async (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault();
    
        if (!topic || !stack || !cardList) {
            return;
        }
    
        const variables = {
            topicId: topic.id,
            aiId: topic.aiId,
            card: {
                title: stackTitle,
                prompts: stack,
            },
        };
    
        try {
            const newCard = await createCard({ variables });
    
            if (!newCard.data) {
                return;
            }
    
            let copied = cardList ? [...cardList, newCard.data.createCard] : [newCard.data.createCard];
    
            setCardList(copied);
    
            let t = { ...topic };
            t.cards = t.cards ? [...t.cards, newCard.data.createCard.id] : [newCard.data.createCard.id];
            setTopic(t);
    
            setShowMenu("none");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const doNothing = (e:any)=> {
        e.preventDefault()
    }

    return (
        <div className={style.popup} onSubmit={loading? doNothing : addPrompt}>
            <div className={style.header}>
                <div className={style[`header-title`]}>Add a Stack</div>
                <div className={`${style[`header-close`]} p`} onClick={closePanel}>x</div>
            </div>
            <form action="" className={style.form}>
                <label className={style.title}>{"Stack Title"}</label>
                <input type="text" placeholder=" stack title" onChange={ e=> setStackTitle(e.target.value)} minLength={1} required/>

                <div className={style[`stack-header`]}>
                    <label className={style.title}>{`Prompt Stack: ${count}`}</label>
                    <button onClick={addToStack}>+ Add to Stack</button>
                </div>
                <input value={promptTitle} type="text" placeholder="prompt title" onChange={e=> setPromptTitle(e.target.value)} minLength={1} required={(stack && stack?.length > 0)? false:true}/>
                <textarea value={promptContent} placeholder="Write your prompt" onChange={e=> setPromptContent(e.target.value)} required={(stack && stack?.length > 0)? false:true}/>

                <div className={style.buttons}>
                    <button type="submit">Add Prompt</button>
                </div>
            </form>
        </div>
    )
}

export default AddStack