import { Dispatch, useEffect, useState } from 'react'

import { Card, Mains, Visibility } from '../types'

import { useQuery } from '@apollo/client';
import { GET_CARDS } from '@/queries'

import PromptCard from './PromptCard'
import AddCardButton from './AddCardButton'

import style from '../styles/mainContent.module.css'

interface MainContentGridProps {
    mains: Mains
    cardList: Card[] | undefined
    columns: number
    visibility: Visibility
    setVisibility: Dispatch<Visibility>
    setCardList: Dispatch<Card[]>
    setMains: Dispatch<Mains>
}

interface getCardsData {
    getCards: Card[]
}

interface getCardsVariables {
    topicId: string | undefined
}

const MainContentGrid = ({cardList, mains, columns, visibility, setVisibility, setCardList, setMains }: MainContentGridProps)=> {
    
    let [changed, setChanged] = useState<boolean>(false)

    const { loading: cardLoading, error: cardError, data: cardData, refetch } = useQuery<getCardsData, getCardsVariables>(GET_CARDS, {
        variables: {topicId:mains.topic?.id},
        skip: !mains.topic?.id
    });

    useEffect(()=> {
        refetch()
    }, [mains.main, cardList])
    
    useEffect(()=> {
        setChanged(!changed)
    }, [columns])
    
    useEffect(()=> {
        if (cardData) {
            setCardList(cardData.getCards)
        }
    }, [cardData]) //eslint-disable-line

    

    const loadPrompts = () => {
        if (!mains.main || !cardList) {
            return
        }
        const newCardList = cardList.filter(c => c.fav !== true)
        return newCardList.map((c: Card,i: number)=> <PromptCard key={i} card={c} cardList={cardList} visibility={visibility} setCardList={setCardList} mains={mains} setVisibility={setVisibility} setMains={setMains}/>).reverse()
    }

    const loadFavPrompts = () => {
        if (!mains.main || !cardList) {
            return
        }
        const newCardList = cardList.filter(c => c.fav === true)
        return newCardList.map((c: Card,i: number)=> <PromptCard key={i} card={c} cardList={cardList} visibility={visibility} setCardList={setCardList} mains={mains} setVisibility={setVisibility} setMains={setMains}/>).reverse()
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
            {mains.topic !== undefined && <AddCardButton visibility={visibility}  setVisibility={setVisibility}/>}
        </div>
    )
}

export default MainContentGrid