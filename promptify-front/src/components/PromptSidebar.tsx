import { useEffect, useState, Dispatch } from 'react'
import { Prompt, Card } from '../types'
import style from '../styles/promptSidebar.module.css'

interface PromptSidebarProps {
    currCard: Card | undefined
    showPS: boolean
    setShowPS: Dispatch<boolean>
    setCurrentCard: Dispatch<Card | undefined>
}


const PromptSidebar = ({currCard, setShowPS, showPS, setCurrentCard} : PromptSidebarProps)=> {


    const [card, setCard] = useState<Card | undefined>(currCard)
    const [index, setIndex] = useState<number>(0)


    useEffect(()=> {
        setIndex(0)
        setCard(currCard)
    }, [currCard])

    const clear = ()=> {
        setCard(currCard)
    }

    const restart = ()=> {
        setIndex(0)
        setCard(currCard)
    }

    const copy = ()=> {
        if (typeof card?.prompts[index].content === "string") {
            navigator.clipboard.writeText(card.prompts[index].content)
            .then(()=> forward())
        }
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>)=> {
        let copia = JSON.parse(JSON.stringify(card))
        copia.prompts[index].content = e.target.value
        setCard(copia)
    }

    const close = ()=> {
        setShowPS(false)
        setCurrentCard(undefined)
    }

    const forward = ()=> {
        if (!card) {
            return
        }
        const maxind = card.prompts.length - 1
        if (index + 1 <= maxind) {
            setIndex(index + 1)
        }
    }

    const back = ()=> {
        // const maxind = card.prompts.length - 1
        if (index - 1 >= 0) {
            setIndex(index - 1)
        }
    }


    return (
        <div style={!showPS? {} : {}} className={(currCard !== undefined && showPS == true)? style[`prompt-sidebar`] : `${style['prompt-sidebar']} ${style['hidden-bar']}`}>
            <div className={style.header}>
                <span className={`${style[`back-button`]} p`} onClick={close}></span>
                <div className={style.buttons}>
                    <div className='p' onClick={restart}>RESTART</div> 
                    <div className='p' onClick={clear}>CLEAR</div>   
                    <div className='p' onClick={copy}>COPY</div>
                </div>
            </div>
            <div className={style.content}>
                <div className={style[`content-title`]}>{currCard?.title}</div>
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