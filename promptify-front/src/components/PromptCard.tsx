import { Dispatch, useState } from 'react'
import { Card, Topic } from '../types'
import { DELETE_CARD, ADD_CARD_FAV } from '@/queries'
import { useMutation } from '@apollo/client'
import DeleteAlert from './DeleteAlert'
import style from '../styles/prompt.module.css'

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
        <div className={card.prompts.length > 1? `${style.prompt} ${style.stack}` : style.prompt } >
            {(deleteAlert === "prompt") && <DeleteAlert setDeleteAlert={setDeleteAlert} deleteHandler={deleteCardHandler} />}
            <div className='p' onClick={openCardHandler}>
                <div className={style.title}>{card.title}</div>
                <div className={style.content}>{card.prompts[0].content}</div>
            </div>
            <div className={style.options}>
                <div className={`${style.delete} p`} onClick={()=>setDeleteAlert("prompt")}></div>
                <div className={card.fav? `${style.fav} ${style[`fav-on`]} p` : `${style.fav} p`} onClick={addToFavs}></div>
                
                {/* <div className="prompt-edit p">EDIT</div> */}
            </div>
        </div>
    )
}

export default PromptCard