
import { useState, Dispatch } from 'react'

import { Visibility, Card, Mains } from '../types'
import { doNothing, closePopUp } from '@/utils/functions';

import { useMutation } from '@apollo/client';
import { ADD_CARD } from '@/queries'

import style from '../styles/popups.module.css'

interface AddPromptProps {
    setVisibility : React.Dispatch<React.SetStateAction<Visibility>>
    mains         : Mains
    cardList      : Card[] | undefined
    setCardList   : Dispatch<Card[]>
    setMains      : Dispatch<Mains>
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

const AddPrompt = ({cardList, mains, setCardList, setVisibility, setMains} : AddPromptProps)=> {

    const [ title,   setTitle    ] = useState<string>("")
    const [ content, setContent  ] = useState<string>("")

    const [ createCard, { loading } ] = useMutation<addCardData, addCardVariables>(ADD_CARD)

    const addPrompt = async (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault();
      
        if (!mains.topic) {
            return;
        }
      
        const { id, aiId } = mains.topic;
      
        const variables = {
            topicId: id,
            aiId,
            card: {
                title,
                prompts: [
                {
                    title: "",
                    content,
                },
                ],
            },
        };
      
        try {
            const { data: newCard } = await createCard({ variables });
        
            if (newCard) {
                const updatedCardList = cardList ? [...cardList, newCard.createCard] : [newCard.createCard];
        
                if (!updatedCardList) return;
        
                setCardList(updatedCardList);
        
                const updatedTopic = { ...mains.topic };
                updatedTopic.cards = updatedTopic.cards?.concat(newCard.createCard.id);
                setMains({...mains, topic: updatedTopic})
                setVisibility(prev=>({...prev, showMenu: "none"}))
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={style.popup} onSubmit={loading? doNothing : addPrompt}>
            
            <div className={style.header}>
                <div className={style[`header-title`]}>Add a Prompt</div>
                <button className={style[`header-close`]} onClick={e=>closePopUp(e, setVisibility)}>x</button>
            </div>

            <form action="" className={style.form}>
                <label className={style.title}>{"Title"}</label>
                <input type="text" placeholder="title" onChange={e=> setTitle(e.target.value)} minLength={1} required/>

                <label className={style.title}>{"Prompt"}</label>
                <textarea value={content} placeholder="Write your prompt" onChange={e=> setContent(e.target.value)} required/>

                <div className={style.buttons}>
                    <button type="submit">Add Prompt</button>
                </div>
            </form>
            
        </div>
    )
}

export default AddPrompt