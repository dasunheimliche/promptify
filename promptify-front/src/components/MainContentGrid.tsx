import { Dispatch, useEffect, useState } from 'react'
import { Card, AI, Topic } from '../types'
import { GET_CARDS } from '@/queries'
import { useQuery } from '@apollo/client';

import PromptCard from './PromptCard'
import AddCardButton from './AddCardButton'

import style from '../styles/mainContent.module.css'
import { profile } from 'console';

interface MainContentGridProps {
    main: AI | undefined
    topic: Topic | undefined
    currentCard: Card | undefined
    cardList: Card[] | undefined
    columns: number
    profile: boolean
    setShowPS: Dispatch<boolean>
    setShowMenu: Dispatch<string>
    setCurrentCard: Dispatch<Card | undefined>
    setCardList: Dispatch<Card[]>
    setTopic: Dispatch<Topic>
}

interface getCardsData {
    getCards: Card[]
}

interface getCardsVariables {
    list: string[] | undefined
}

const MainContentGrid = ({cardList, currentCard, main, topic, columns, setShowMenu, setCurrentCard, setShowPS, setCardList, setTopic }: MainContentGridProps)=> {
    
    let [changed, setChanged] = useState<boolean>(false)
    
    const { loading: cardLoading, error: cardError, data: cardData } = useQuery<getCardsData, getCardsVariables>(GET_CARDS, {
        variables: {list:topic?.cards}
    });
    
    useEffect(()=> {
        setChanged(!changed)
    }, [columns])
    
    useEffect(()=> {
        if (cardData) {
            setCardList(cardData.getCards)
        }
    }, [cardData]) //eslint-disable-line

    const loadPrompts = () => {
        if (!main || !cardList) {
            return
        }
        const newCardList = cardList.filter(c => c.fav !== true)
        return newCardList.map((c: Card,i: number)=> <PromptCard key={i} card={c} currentCard={currentCard} cardList={cardList} setCardList={setCardList} topic={topic}  setCurrentCard={setCurrentCard} setShowPS={setShowPS} setTopic={setTopic}/>).reverse()
    }

    const loadFavPrompts = () => {
        if (!main || !cardList) {
            return
        }
        const newCardList = cardList.filter(c => c.fav === true)
        return newCardList.map((c: Card,i: number)=> <PromptCard key={i} card={c} currentCard={currentCard} cardList={cardList} setCardList={setCardList} topic={topic}  setCurrentCard={setCurrentCard} setShowPS={setShowPS} setTopic={setTopic}/>).reverse()
    }

    const theresfavs = ()=> {
        return cardList?.some(card => card.fav)
    }

    return (
        <div className={style[`cards-wrapper`]}>
            
            {theresfavs() && <div className={style[`grid-favs`]}>Favourites</div>}
            <div id={style.grid} style={{columnCount: `${columns}`}} className={!changed? `${style.grid}` : `${style.grid} ${style.changed2}`}> 
                {theresfavs() && loadFavPrompts()}
            </div>
            {theresfavs() && <div className={style[`divisor-grid`]}></div>}
            <div  id={style.grid} style={{columnCount: `${columns}`}} className={!changed? `${style.grid} ${style['no-favs']}` : `${style.grid} ${style['no-favs']} ${style.changed2}`}> 
                {loadPrompts()}
            </div>
            {/* {(cardList === undefined && !profile) && <div className={style.loading}></div>} */}
            {topic !== undefined && <AddCardButton  setShowMenu={setShowMenu}/>}
        </div>
    )
}

export default MainContentGrid