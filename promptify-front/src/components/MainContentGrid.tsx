import { Dispatch, useEffect, useState } from 'react'

import { Card, Mains, Visibility, getCardsData, getCardsVariables } from '../types'
import { theresFavs } from '@/utils/functions';
import { GET_CARDS } from '@/queries';
import { useQuery } from '@apollo/client';

import PromptCard from './PromptCard'
import AddCardButton from './AddCardButton'

import style from '../styles/mainContent.module.css'

interface MainContentGridProps {
    mains: Mains
    columns: number
    visibility: Visibility
    setVisibility: Dispatch<Visibility>
    setMains: Dispatch<Mains>
}


const MainContentGrid = ({mains, columns, visibility, setVisibility, setMains }: MainContentGridProps)=> {
    
    let [changed, setChanged] = useState<boolean>(false)

    const { data: { getCards: cardList } = {} } = useQuery<getCardsData, getCardsVariables>(GET_CARDS, {
        variables: {topicId: mains.topic?.id}, 
        skip: !mains.topic?.id 
    });

    //** EVENT HANDLERS

    const loadPrompts = (isFav = false) => {
        if (!mains || !cardList) {
            return;
        }
        
        const newCardList = cardList.filter(c => (isFav ? c.fav === true : c.fav !== true));
        
        return newCardList.map((c, i) => (
            <PromptCard
                key={i}
                card={c}
                visibility={visibility}
                mains={mains}
                setVisibility={setVisibility}
                setMains={setMains}
            />
        )).reverse();
    };

    useEffect(()=> {
        setChanged(!changed)
    }, [columns]) // eslint-disable-line

    return (
        <div className={style[`cards-wrapper`]}>
            
            {theresFavs(cardList) && <div className={style[`grid-favs`]}>Favourites</div>}
            <div id={style.grid}  className={`${style.grid}`}> 
                {theresFavs(cardList) && loadPrompts(true)}
            </div>
            {theresFavs(cardList) && <div className={style[`divisor-grid`]}></div>}
            <div  id={style.grid}  className={`${style.grid} ${style['no-favs']}`}> 
                {loadPrompts()}
            </div>
            {mains.topic !== undefined && <AddCardButton visibility={visibility}  setVisibility={setVisibility}/>} 
            
        </div>
    ) // * main.mains
}

export default MainContentGrid