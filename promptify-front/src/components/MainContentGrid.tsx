import { Dispatch, useEffect } from 'react'
import { Card, AI, Topic } from '../types'
import { GET_CARDS } from '@/queries'
import { useQuery } from '@apollo/client';

import PromptCard from './PromptCard'
import AddCardButton from './AddCardButton'

import style from '../styles/mainContent.module.css'

interface MainContentGridProps {
    main: AI | undefined
    topic: Topic | undefined
    cardList: Card[] | undefined
    columns: number
    setShowPS: Dispatch<boolean>
    setShowMenu: Dispatch<string>
    setCurrentCard: Dispatch<Card>
    setCardList: Dispatch<Card[]>
}

interface getCardsData {
    getCards: Card[]
}

interface getCardsVariables {
    list: string[] | undefined
}

const MainContentGrid = ({cardList, main, topic, columns, setShowMenu, setCurrentCard, setShowPS, setCardList }: MainContentGridProps)=> {
    console.log("CARD LIST", cardList)
    const { loading: cardLoading, error: cardError, data: cardData } = useQuery<getCardsData, getCardsVariables>(GET_CARDS, {
        variables: {list:topic?.cards}
      });
    
    
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
        return newCardList.map((c: Card,i: number)=> <PromptCard key={i} card={c} cardList={cardList} setCardList={setCardList} topic={topic}  setCurrentCard={setCurrentCard} setShowPS={setShowPS}/>).reverse()
    }

    const loadFavPrompts = () => {
        if (!main || !cardList) {
            return
        }
        const newCardList = cardList.filter(c => c.fav === true)
        return newCardList.map((c: Card,i: number)=> <PromptCard key={i} card={c} cardList={cardList} setCardList={setCardList} topic={topic}  setCurrentCard={setCurrentCard} setShowPS={setShowPS}/>).reverse()
    }

    const theresfavs = ()=> {
        return cardList?.some(card => card.fav)
    }

    return (
        <div className={style[`cards-wrapper`]}>
            {theresfavs() && <div className={style[`grid-favs`]}>Favourites</div>}
            <div style={{columnCount: `${columns}`}} className={style.grid}> 
                {theresfavs() && loadFavPrompts()}
            </div>
            {theresfavs() && <div className={style[`divisor-grid`]}></div>}
            <div style={{columnCount: `${columns}`}} className="mc-grid"> 
                {loadPrompts()}
            </div>
            {topic !== undefined && <AddCardButton  setShowMenu={setShowMenu}/>}
        </div>
    )
}

export default MainContentGrid