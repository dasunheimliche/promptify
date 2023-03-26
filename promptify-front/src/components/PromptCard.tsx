import { Dispatch, useState } from 'react'
import { Card, Topic } from '../types'
import { DELETE_CARD, ADD_CARD_FAV } from '@/queries'
import { useMutation } from '@apollo/client'
import DeleteAlert from './DeleteAlert'

interface PromptProps {
    card: Card
    cardList: Card[]
    topic: Topic | undefined
    setCurrentCard: Dispatch<Card>
    setCardList: Dispatch<Card[]>
    setShowPS: Dispatch<boolean>
}

const PromptCard = ({card, topic, cardList, setCurrentCard, setCardList, setShowPS} : PromptProps)=> {

    const [deleteCard, { error, data }] = useMutation(DELETE_CARD)
    const [deleteAlert, setDeleteAlert] = useState<string>("none")

    const [addCardToFavs] = useMutation(ADD_CARD_FAV)

    const openCardHandler = ()=> {
        setCurrentCard(card)
        setShowPS(true)
    }

    const deleteCardfunc = async (cardId:string, topicId:string)=> {
        const deleted = await deleteCard({variables: {cardId, topicId}})

        if(deleted) {
            const newCardList = cardList.filter(arrayCard => arrayCard.id !== card.id)
            setCardList(newCardList)
        }

    }

    const deleteCardHandler = ()=> {
        if (!card || !topic) {
            return
        }
        deleteCardfunc(card.id, topic.id)
    }

    const addToFavs = async()=> {
        const newCard = await addCardToFavs({variables: {cardId: card.id}})
        const cardIndex = cardList.findIndex(c => c.id === card.id)
        const newCardList = [...cardList]
        newCardList[cardIndex] = newCard.data.addCardToFavs
        setCardList(newCardList)
    }


    return (
        <div className={card.prompts.length > 1? "prompt stack" : "prompt"} >
            {(deleteAlert === "prompt") && <DeleteAlert setDeleteAlert={setDeleteAlert} deleteHandler={deleteCardHandler} />}
            <div className='prompt-content p' onClick={openCardHandler}>
                <div className="prompt-title">{card.title}</div>
                <div className="prompt-text">{card.prompts[0].content}</div>
            </div>
            <div className='prompt-options'>
                <div style={card.fav? {color: "yellow"} : {}} className="prompt-fav p" onClick={addToFavs}>FAV</div>
                <div className="prompt-edit p">EDIT</div>
                <div className="prompt-delete p" onClick={()=>setDeleteAlert("prompt")}>DEL</div>
            </div>
        </div>
    )
}

export default PromptCard