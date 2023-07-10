import { Dispatch, useState } from 'react'

import { useMutation } from '@apollo/client'
import { DELETE_CARD, ADD_CARD_FAV, GET_CARDS } from '@/queries'

import { Card, Mains, Visibility } from '../types'
import { doNothing } from '@/utils/functions'

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

const PromptCard = ({card, mains, visibility, setMains, setVisibility} : PromptProps)=> {
    // STATE
    const [edit,        setEdit        ] = useState<boolean>(false)
    const [remove,      setRemove      ] = useState<boolean>(false)   

    // MUTATIONS
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

    // EVENT HANDLER
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
    //* mains.currCard x 2
    return (
        <div className={card.prompts.length > 1? (card.id === mains.currCard?.id? `${style.prompt} ${style.stack} ${style.selected}`:`${style.prompt} ${style.stack}`) : (card.id === mains.currCard?.id? `${style.prompt} ${style.selected}` :style.prompt) } > 
            {remove && <DeleteAlert onAccept={deleteCardHandler} onCancel={setRemove} loading={DCloading}/>}
            {edit && 
                <EditPrompt 
                    card={card} 
                    mains={mains} 
                    edit={edit} 
                    setEdit={setEdit} 
                    setMains={setMains}/>
            }
            <div className='p' onClick={openCardHandler}>
                <div className={style.title}>{card.title}</div>
                <div className={style.content}>{card.prompts[0].content}</div>
            </div>
            <div className={style.options}>
                <div className={`${style.delete} p`} onClick={()=>setRemove(true)}></div>
                <div className={`${style.edit} p`} onClick={()=>setEdit(!edit)}></div>
                <div className={card.fav? `${style.fav} ${style[`fav-on`]} p` : `${style.fav} p`} onClick={ACTFloading? doNothing : addToFavs}></div>
            </div>
        </div>
    )
}

export default PromptCard