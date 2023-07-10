import { useState } from 'react'

import { Card, Mains, Visibility } from '../types'
import { doNothing, closePopUp } from '@/utils/functions';

import { useMutation } from '@apollo/client';
import { ADD_CARD, GET_CARDS } from '@/queries'

import style from '../styles/popups.module.css'

interface AddPromptProps {
    setVisibility: React.Dispatch<React.SetStateAction<Visibility>>
    mains: Mains
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

const AddStack = ({ mains, setVisibility } : AddPromptProps)=> {

    const [stackTitle,    setStackTitle   ] = useState<string>("")
    const [count,         setCount        ] = useState<number>(0)

    const [stack,         setStack        ] = useState<promptVariables[] | undefined>([])
    const [promptTitle,   setPromptTitle  ] = useState<string>("")
    const [promptContent, setPromptContent] = useState<string>("")

    const [ createCard, { loading } ] = useMutation<addCardData, addCardVariables>(ADD_CARD, {
        update: (cache, response) => {
            cache.updateQuery({ query: GET_CARDS, variables: {topicId: mains.topic?.id} }, ({getCards}) => { // * main.mains
                return {
                    getCards: getCards.concat(response.data?.createCard)
              }
            });
        }
    })

    // EVENT HANDLERS

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
    
        if (!mains.topic || !stack) { 
            return;
        }
    
        const variables = {
            topicId: mains.topic.id, 
            aiId: mains.topic.aiId, 
            card: {
                title: stackTitle,
                prompts: stack,
            },
        };
    
        try {
            const newCard = await createCard({ variables });
    
            if (!newCard.data) return
    
            setVisibility(prev=>({...prev, showMenu: "none"}))
        } catch (error) {
            console.error("Error:", error);
        }
    };


    return (
        <div className={style.popup} onSubmit={loading? doNothing : addPrompt}>
            <div className={style.header}>
                <div className={style[`header-title`]}>Add a Stack</div>
                <button className={style[`header-close`]} onClick={e=>closePopUp(e,setVisibility)}>x</button>
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