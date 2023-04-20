import { useEffect, useState, Dispatch } from 'react'
import { Prompt, Card } from '../types'
import style from '../styles/promptSidebar.module.css'

interface PromptSidebarProps {
    currCard: Card
    setShowPS: Dispatch<boolean>
}


const PromptSidebar = ({currCard, setShowPS} : PromptSidebarProps)=> {

    const [card, setCard] = useState<Card>(currCard)
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
        if (typeof card.prompts[index].content === "string") {
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
    }

    const forward = ()=> {
        const maxind = card.prompts.length - 1
        if (index + 1 <= maxind) {
            setIndex(index + 1)
        }
    }

    const back = ()=> {
        const maxind = card.prompts.length - 1
        if (index - 1 >= 0) {
            setIndex(index - 1)
        }
    }


    return (
        <div className={style[`prompt-sidebar`]}>
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
                    {card.prompts.length > 1 && <div>{`${index + 1} - ${card.prompts[index].title}`}</div>}
                </div>
                <textarea className={style[`content-textarea`]} placeholder='prompt' value={card.prompts[index].content} onChange={onChangeHandler} spellCheck="false"></textarea>
                <div className={style[`content-playback`]}>
                    <div onClick={back}>{"< "}</div>
                    <div>{`${index+1}/${card.prompts.length}`}</div>
                    <div onClick={forward}>{" >"}</div>
                </div>
            </div>
        </div>
    )
    
}

export default PromptSidebar