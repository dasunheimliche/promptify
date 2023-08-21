import style from '../styles/mainContent.module.css'

import { Dispatch } from 'react'

import { theresFavs } from '@/utils/functions';

import { useQuery } from '@apollo/client';

import AddCardButton from './AddCardButton'

import { Mains, Visibility, getCardsData, getCardsVariables } from '../types'
import { GET_CARDS } from '@/queries';
import { CardtList } from './MainContentModule';

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

    const handleOpenAddPromptMenu = ()=> {
        setVisibility({...visibility, showMenu: "add stack"})
    }

    const handleOpenAddStackMeny = ()=> {
        setVisibility({...visibility, showMenu: "add prompt"})
    }

    return (
        <div className={style[`cards-wrapper`]}>
            
            {theresFavs(cardList) && <div className={style[`grid-favs`]}>
                <span className={style['favs-title']}>Favourites</span>
                <CardtList 
                    cardList={cardList}
                    mains={mains}
                    visibility={visibility}
                    setVisibility={setVisibility}
                    setMains={setMains}
                    isFav={true}
                />
            
            </div>}

            {theresFavs(cardList) && <div className={style[`divisor-grid`]}></div>}

            <CardtList 
                cardList={cardList}
                mains={mains}
                visibility={visibility}
                setVisibility={setVisibility}
                setMains={setMains}
            />

            {mains.topic !== undefined && 
                <AddCardButton onOpenAddPromptMenu={handleOpenAddPromptMenu}  onOpenAddStackMenu={handleOpenAddStackMeny}/>
            } 
            
        </div>
    )
}

export default MainContentGrid