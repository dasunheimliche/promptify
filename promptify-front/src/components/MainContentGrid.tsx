import { Dispatch, useEffect, useState } from 'react'

import { Card, Mains, Visibility } from '../types'
import { theresFavs } from '@/utils/functions';

import PromptCard from './PromptCard'
import AddCardButton from './AddCardButton'

import style from '../styles/mainContent.module.css'

interface MainContentGridProps {
    mains: Mains
    cardList: Card[] | undefined
    columns: number
    visibility: Visibility
    setVisibility: Dispatch<Visibility>
    setMains: Dispatch<Mains>
}


const MainContentGrid = ({cardList, mains, columns, visibility, setVisibility, setMains }: MainContentGridProps)=> {
    //** STATES
    let [changed, setChanged] = useState<boolean>(false)

    useEffect(()=> {
        setChanged(!changed)
    }, [columns]) // eslint-disable-line

    //** EVENT HANDLERS

    const loadPrompts = (isFav = false) => {
        if (!mains.main || !cardList) {
            return;
        }
        
        const newCardList = cardList.filter(c => (isFav ? c.fav === true : c.fav !== true));
        
        return newCardList.map((c, i) => (
            <PromptCard
                key={i}
                card={c}
                cardList={cardList}
                visibility={visibility}
                mains={mains}
                setVisibility={setVisibility}
                setMains={setMains}
            />
        )).reverse();
    };

    return (
        <div className={style[`cards-wrapper`]}>
            
            {theresFavs(cardList) && <div className={style[`grid-favs`]}>Favourites</div>}
            <div id={style.grid} style={{columnCount: `${columns}`}} className={!changed? `${style.grid}` : `${style.grid} ${style.changed2}`}> 
                {theresFavs(cardList) && loadPrompts(true)}
            </div>
            {theresFavs(cardList) && <div className={style[`divisor-grid`]}></div>}
            <div  id={style.grid} style={{columnCount: `${columns}`}} className={!changed? `${style.grid} ${style['no-favs']}` : `${style.grid} ${style['no-favs']} ${style.changed2}`}> 
                {loadPrompts()}
            </div>
            {mains.topic !== undefined && <AddCardButton visibility={visibility}  setVisibility={setVisibility}/>}
        </div>
    )
}

export default MainContentGrid