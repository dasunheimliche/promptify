import style from '../styles/promptSidebar.module.css'

import { useState, Dispatch, useMemo } from 'react'

import { useQuery } from '@apollo/client'

import { Card, Mains, Visibility,getCardsData, getCardsVariables } from '../types'
import { GET_CARDS } from '@/queries'

interface PromptSidebarProps {
    mains: Mains
    visibility: Visibility
    setVisibility: Dispatch<Visibility>
    setMains: Dispatch<Mains>
}


const PromptSidebar = ({mains, setVisibility, visibility, setMains} : PromptSidebarProps)=> {

    console.log("VISIBILITY ", visibility.showPS)

    const { data: { getCards: cardList } = {} } = useQuery<getCardsData, getCardsVariables>(GET_CARDS, {
        variables: {topicId: mains.topic?.id},
        skip: !mains.topic?.id
      });

    const currentCard = cardList?.find((card: Card) => card.id === mains.currCard?.id)

    const [card,   setCard  ] = useState<Card | undefined>(currentCard)
    const [index,  setIndex ] = useState<number>(0)
    const [edited, setEdited] = useState<boolean>(false)

    // deshabilito el lintern para que la comparación se haga solo cuando "currentCard" cambie, y no cuando card también.
    useMemo(() => {
        if (currentCard !== card && currentCard) {
            setEdited(true)
        }
    }, [currentCard]) // eslint-disable-line 

    const clear = ()=> {
        setCard(currentCard) 
    }

    const restart = ()=> {
        setIndex(0)
        setCard(currentCard) 
        setEdited(false)
    }

    const copy = ()=> {
        if (typeof card?.prompts[index].content === "string") {
            navigator.clipboard.writeText(card.prompts[index].content)
            .then(()=> forward())
        }
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>)=> {
        let copia = JSON.parse(JSON.stringify(currentCard))
        copia.prompts[index].content = e.target.value
        setCard(copia)
    }

    const close = ()=> {
        setVisibility({...visibility, showPS: false})
        setMains({...mains, currCard: undefined})
    }

    const forward = ()=> {
        if (!card) return
 
        const maxind = card.prompts.length - 1

        if (index + 1 <= maxind) setIndex(index + 1)
        
    }

    const back = ()=> {
        if (index - 1 >= 0) setIndex(index - 1)
    }

    return (
        <div className={(card !== undefined && visibility.showPS === true )? style[`prompt-sidebar`] : `${style['prompt-sidebar']} ${style['hidden-bar']}`}>
            <div className={style.header}>
                <span className={`${style[`back-button`]} p`} onClick={close}></span>
                <div className={style.buttons}>
                    <div className={edited? `p ${style.update}` : `p`} onClick={restart}>{edited? "UPDATE" : "RESTART"}</div> 
                    <div className='p' onClick={clear}>CLEAR</div>   
                    <div className='p' onClick={copy}>COPY</div>
                </div>
            </div>
            <div className={style.content}>
                <div className={style[`content-title`]}>{card?.title}</div>
                <div className={style[`content-subtitle-container`]}>
                    {(card && card.prompts.length > 1) && <div>{`${index + 1} - ${card.prompts[index].title}`}</div>}
                </div>
                <textarea className={style[`content-textarea`]} placeholder='prompt' value={card?.prompts[index].content} onChange={onChangeHandler} spellCheck="false"></textarea>
                <div className={style[`content-playback`]}>
                    <div className={style.playback} onClick={back}>{"< "}</div>
                    <div>{`${index+1}/${card?.prompts.length}`}</div>
                    <div className={style.playback} onClick={forward}>{" >"}</div>
                </div>
            </div>
        </div>
    )
    
}

export default PromptSidebar