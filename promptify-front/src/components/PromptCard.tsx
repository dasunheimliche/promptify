import { Dispatch, useState } from 'react'

import { useMutation } from '@apollo/client'
import { DELETE_CARD, ADD_CARD_FAV } from '@/queries'

import { Card, Mains, Visibility } from '../types'
import { doNothing } from '@/utils/functions'

import DeleteAlert from './DeleteAlert'
import EditPrompt from './EditPrompt'
import style from '../styles/prompt.module.css'

interface PromptProps {
    card: Card
    cardList: Card[]
    mains: Mains
    visibility: Visibility
    setVisibility: Dispatch<Visibility>
    setCardList: Dispatch<Card[]>
    setMains: Dispatch<Mains>
}

const PromptCard = ({card, mains, cardList, visibility, setCardList, setMains, setVisibility} : PromptProps)=> {
    // STATE
    const [deleteAlert, setDeleteAlert ] = useState<string>("none")
    const [edit,        setEdit        ] = useState<boolean>(false)

    // MUTATIONS
    const [deleteCard,    { loading: DCloading }] = useMutation(DELETE_CARD)
    const [addCardToFavs, {loading: ACTFloading}] = useMutation(ADD_CARD_FAV)

    // EVENT HANDLER
    const openCardHandler = ()=> {
        setMains({...mains, currCard: card})
        setVisibility({...visibility, showPS: true})

        if (card.id === mains.currCard?.id) {
            setVisibility({...visibility, showPS: false})
            setMains({...mains, currCard: undefined})
        }
    }

    const deleteCardfunc = async (cardId: string, topicId: string) => {
        try {
            const deleted = await deleteCard({ variables: { cardId, topicId } });
        
            if (!mains.topic) {
                    return;
            }
        
            if (deleted) {
                    const newCardList = cardList.filter((arrayCard) => arrayCard.id !== cardId);
                    setCardList(newCardList);
            }
        
            const updatedTopic = { ...mains.topic };
            const updatedCards = updatedTopic.cards?.filter((id) => id !== cardId);
            updatedTopic.cards = updatedCards;
        
            setMains({...mains, topic: updatedTopic});
        } catch (error) {
            console.error("Error deleting card:", error);
        }
      };

    const deleteCardHandler = ()=> {
        if (!card || !mains.topic) {
            return
        }
        deleteCardfunc(card.id, mains.topic.id)
        setDeleteAlert("none")
    }

    const addToFavs = async () => {
        try {
            const { id } = card;
            const newCard = await addCardToFavs({ variables: { cardId: id } });
            const cardIndex = cardList.findIndex(c => c.id === id);
            const newCardList = cardList.slice();
            newCardList[cardIndex] = newCard.data.addCardToFavs;
            setCardList(newCardList);
        } catch (error) {
            console.error('Error al agregar la tarjeta a favoritos:', error);
        }
      };

    return (
        <div className={card.prompts.length > 1? (card.id === mains.currCard?.id? `${style.prompt} ${style.stack} ${style.selected}`:`${style.prompt} ${style.stack}`) : (card.id === mains.currCard?.id? `${style.prompt} ${style.selected}` :style.prompt) } >
            {(deleteAlert === "prompt") && <DeleteAlert setDeleteAlert={setDeleteAlert} deleteHandler={deleteCardHandler} loading={DCloading}/>}
            {edit && <EditPrompt card={card} mains={mains} cardList={cardList} edit={edit} setCardList={setCardList} setEdit={setEdit} setMains={setMains}/>}
            <div className='p' onClick={openCardHandler}>
                <div className={style.title}>{card.title}</div>
                <div className={style.content}>{card.prompts[0].content}</div>
            </div>
            <div className={style.options}>
                <div className={`${style.delete} p`} onClick={()=>setDeleteAlert("prompt")}></div>
                <div className={`${style.edit} p`} onClick={()=>setEdit(!edit)}></div>
                <div className={card.fav? `${style.fav} ${style[`fav-on`]} p` : `${style.fav} p`} onClick={ACTFloading? doNothing : addToFavs}></div>
            </div>
        </div>
    )
}

export default PromptCard