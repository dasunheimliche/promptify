import style from '../styles/mainContent.module.css'

import { Dispatch } from 'react'

import { theresFavs } from '@/utils/functions';

import { useQuery } from '@apollo/client';

import PromptCard from './PromptCard'
import AddCardButton from './AddCardButton'

import { Mains, Visibility, getCardsData, getCardsVariables } from '../types'
import { GET_CARDS } from '@/queries';

interface MainContentGridProps {
    mains: Mains
    visibility: Visibility
    setVisibility: Dispatch<Visibility>
    setMains: Dispatch<Mains>
}


const MainContentGrid = ({mains, visibility, setVisibility, setMains }: MainContentGridProps)=> {
    
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

    return (
        <div className={style[`cards-wrapper`]}>
            
            {theresFavs(cardList) && <div className={style[`grid-favs`]}>Favourites</div>}

            <div className={`${style.grid}`}> 
                {theresFavs(cardList) && loadPrompts(true)}
            </div>

            {theresFavs(cardList) && <div className={style[`divisor-grid`]}></div>}

            <div className={`${style.grid} ${style['no-favs']}`}> 
                {loadPrompts()}
            </div>

            {mains.topic !== undefined && <AddCardButton visibility={visibility}  setVisibility={setVisibility}/>} 
            
        </div>
    ) // * main.mains
}

export default MainContentGrid