import { ADD_CARD } from '@/queries'
import { useState, Dispatch } from 'react'
import { Topic, Card } from '../types'
import { useMutation } from '@apollo/client';
import style from '../styles/popups.module.css'

interface AddPromptProps {
    setShowMenu : Dispatch<string>
    topic       : Topic  | undefined
    cardList    : Card[] | undefined
    setCardList : Dispatch<Card[]>
    setTopic    : Dispatch<Topic>
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

const AddPrompt = ({cardList, topic, setCardList, setShowMenu, setTopic} : AddPromptProps)=> {

    const [ title,   setTitle    ] = useState<string>("")
    const [ content, setContent ] = useState<string>("")

    const [ createCard, { loading } ] = useMutation<addCardData, addCardVariables>(ADD_CARD)

    const closePanel = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=> {
        e.preventDefault()
        setShowMenu("none")
    }

    const addPrompt = async (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault();
      
        if (!topic) {
            return;
        }
      
        const { id, aiId } = topic;
      
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
        
                const updatedTopic = { ...topic };
                updatedTopic.cards = updatedTopic.cards?.concat(newCard.createCard.id);
                setTopic(updatedTopic);
                setShowMenu("none");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const doNothing = (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    return (
        <div className={style.popup} onSubmit={loading? doNothing : addPrompt}>
            
            <div className={style.header}>
                <div className={style[`header-title`]}>Add a Prompt</div>
                <div className={`${style[`header-close`]} p`} onClick={closePanel}>x</div>
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