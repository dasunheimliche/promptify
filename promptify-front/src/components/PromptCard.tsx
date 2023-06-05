import { Dispatch, useState } from 'react'

import { useMutation } from '@apollo/client'
import { DELETE_CARD, ADD_CARD_FAV } from '@/queries'

import { Card, Topic } from '../types'

import DeleteAlert from './DeleteAlert'
import EditPrompt from './EditPrompt'
import style from '../styles/prompt.module.css'

interface PromptProps {
    card: Card
    cardList: Card[]
    topic: Topic | undefined
    currentCard: Card | undefined
    setCurrentCard: Dispatch<Card | undefined>
    setCardList: Dispatch<Card[]>
    setShowPS: Dispatch<boolean>
    setTopic: Dispatch<Topic>
}

const PromptCard = ({card, topic, cardList, currentCard, setCurrentCard, setCardList, setShowPS, setTopic} : PromptProps)=> {
    // STATE
    const [deleteAlert, setDeleteAlert] = useState<string>("none")
    const [edit,        setEdit]        = useState<boolean>(false)
    const [editCard,    setEditCard]    = useState<Card | undefined>(card)

    // MUTATIONS
    const [deleteCard, { error, data, loading: DCloading }] = useMutation(DELETE_CARD)
    const [addCardToFavs, {loading: ACTFloading}] = useMutation(ADD_CARD_FAV)

    // EVENT HANDLER
    const openCardHandler = async()=> {
        await setCurrentCard(card)
        setShowPS(true)

        if (card.id === currentCard?.id) {
            setShowPS(false)
            setCurrentCard(undefined)
        }
    }

    const deleteCardfunc = async (cardId:string, topicId:string)=> {
        const deleted = await deleteCard({variables: {cardId, topicId}})

        if (!topic) {
            return
        }

        if(deleted) {
            const newCardList = cardList.filter(arrayCard => arrayCard.id !== card.id)
            setCardList(newCardList)
        }

        let t = {...topic}
        let c = t.cards?.filter(id => id !== topicId)
        t.cards = c

        setTopic(t)

    }

    const deleteCardHandler = ()=> {
        if (!card || !topic) {
            return
        }
        deleteCardfunc(card.id, topic.id)
        setDeleteAlert("none")
    }

    const addToFavs = async()=> {
        const newCard = await addCardToFavs({variables: {cardId: card.id}})
        const cardIndex = cardList.findIndex(c => c.id === card.id)
        const newCardList = [...cardList]
        newCardList[cardIndex] = newCard.data.addCardToFavs
        setCardList(newCardList)
    }

    const doNothing = (e:any) => {
        e.preventDefault()
    }


    return (
        <div className={card.prompts.length > 1? (card.id === currentCard?.id? `${style.prompt} ${style.stack} ${style.selected}`:`${style.prompt} ${style.stack}`) : (card.id === currentCard?.id? `${style.prompt} ${style.selected}` :style.prompt) } >
            {(deleteAlert === "prompt") && <DeleteAlert setDeleteAlert={setDeleteAlert} deleteHandler={deleteCardHandler} loading={DCloading}/>}
            {edit && <EditPrompt card={card} currentCard={currentCard} cardList={cardList} edit={edit} setCardList={setCardList} setEdit={setEdit} setCurrentCard={setCurrentCard}/>}
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