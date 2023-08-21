import { Dispatch, useState } from 'react'

import { useMutation } from '@apollo/client'
import { DELETE_CARD, ADD_CARD_FAV, GET_CARDS } from '@/queries'

import { Card, Mains, Visibility } from '../types'

import DeleteAlert from './DeleteAlert'
import EditPrompt from './EditPrompt'
import style from '../styles/prompt.module.css'

interface PromptProps {
    card: Card
    mains: Mains
    visibility: Visibility
    setVisibility: Dispatch<Visibility>
    setMains: Dispatch<Mains>
}

interface PromptContentProps {
    onClick: ()=>void
    title: string
    prompt: string
}

interface PromptOptionsProps {
    isMutating: boolean
    isFav: boolean
    onOpenDeleteMenu: ()=>void
    onOpenEditMenu: ()=>void
    onToggleFav: ()=>void
}

function PromptContent ({onClick, title, prompt} : PromptContentProps) {
    return(
        <div className='p' onClick={onClick}>
            <div className={style.title}>{title}</div>
            <div className={style.content}>{prompt}</div>
        </div>   
    )
}

function PromptOptions ({isMutating, isFav, onOpenDeleteMenu, onOpenEditMenu, onToggleFav} : PromptOptionsProps) {
    return(
        <div className={style.options}>
            <button className={`${style.delete} p`} title='delete' onClick={onOpenDeleteMenu}></button>
            <button className={`${style.edit} p`} title='edit' onClick={onOpenEditMenu}></button>
            <button className={isFav? `${style.fav} ${style[`fav-on`]} p` : `${style.fav} p`} title='add to favs' onClick={onToggleFav} disabled={isMutating}></button>
        </div>
    )
}

const PromptCard = ({card, mains, visibility, setMains, setVisibility} : PromptProps)=> {
    const [edit,        setEdit        ] = useState<boolean>(false)
    const [remove,      setRemove      ] = useState<boolean>(false)   

    const [deleteCard,    { loading: DCloading }] = useMutation(DELETE_CARD, {
        update: (cache, response) => {
            cache.updateQuery({query: GET_CARDS, variables: {topicId: mains.topic?.id}}, ({ getCards })=> { 
                return {
                    getCards: getCards.filter((card: Card) =>  response.data?.deleteCard !== card.id)
                }
            })
        }
    })
    const [addCardToFavs, {loading: ACTFloading}] = useMutation(ADD_CARD_FAV)

    const openCardHandler = ()=> {
        setMains({...mains, currCard: {id: card.id, aiId: card.aiId, topicId: card.topicId}})
        setVisibility({...visibility, showPS: true})

        if (card.id === mains.currCard?.id) { 
            setVisibility({...visibility, showPS: false})
            setMains({...mains, currCard: undefined})
        }
    }

    const deleteCardfunc = async (cardId: string, topicId: string) => {
        
        try {

            await deleteCard({ variables: { cardId, topicId } });
        
        } catch (error) {
            console.error("Error deleting card:", error);
        }
    };

    const deleteCardHandler = async()=> {
        if (!card || !mains.topic) { 
            return
        }
        await deleteCardfunc(card.id, mains.topic.id) 

        setRemove(false)
    }

    const addToFavs = async () => {
        try {
            const { id } = card;
            await addCardToFavs({ variables: { cardId: id } });

        } catch (error) {
            console.error('Error al agregar la tarjeta a favoritos:', error);
        }
    };

    return (
        <div className={card.prompts.length > 1? (card.id === mains.currCard?.id? `${style.prompt} ${style.stack} ${style.selected}`:`${style.prompt} ${style.stack}`) : (card.id === mains.currCard?.id? `${style.prompt} ${style.selected}` :style.prompt) } > 
            <DeleteAlert onAccept={deleteCardHandler} onCancel={setRemove} loading={DCloading} isShown={remove}/>
            {edit && <EditPrompt card={card} mains={mains} setEdit={setEdit} setMains={setMains}/>}
            <PromptContent title={card.title} prompt={card.prompts[0].content} onClick={openCardHandler}/>
            <PromptOptions 
                isMutating={ACTFloading}
                isFav={card.fav}
                onOpenDeleteMenu={()=>setRemove(true)}
                onOpenEditMenu={()=>setEdit(!edit)}
                onToggleFav={addToFavs}
            />
        </div>
    )
}

export default PromptCard