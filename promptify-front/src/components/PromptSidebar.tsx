import { useEffect, useState, Dispatch } from 'react'
import { Prompt, Card } from '../types'

interface PromptSidebarProps {
    currCard: Card
    setShowPS: Dispatch<boolean>
}


const PromptSidebar = ({currCard, setShowPS} : PromptSidebarProps)=> {

    const [card, setCard] = useState<Card>(currCard)
    const [index, setIndex] = useState<number>(0)


    useEffect(()=> {
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
        <div className='prompt-sidebar'>
            <div className='ps-header'>
                <span className='ps-back-button p' onClick={close}></span>
                <div className="ps-buttons">
                <div className="ps-button p" onClick={restart}>RESTART</div> 
                    <div className="ps-button p" onClick={clear}>CLEAR</div>   
                    <div className="ps-button p" onClick={copy}>COPY</div>
                </div>
            </div>
            <div className="ps-content">
                <div className="ps-content-title">{currCard?.title}</div>
                <div className="ps-content-subtitle-container">
                    {card.prompts.length > 1 && <div className="ps-content-subtitle">{`${index + 1} - ${card.prompts[index].title}`}</div>}
                </div>
                <textarea className='ps-content-textarea' placeholder='prompt' value={card.prompts[index].content} onChange={onChangeHandler} spellCheck="false"></textarea>
                <div className="ps-content-playback">
                    <div className="psc-back p" onClick={back}>{"< "}</div>
                    <div className="psc-display">{`${index+1}/${card.prompts.length}`}</div>
                    <div className="psc-fwrd p" onClick={forward}>{" >"}</div>
                </div>
            </div>
        </div>
    )
    
}

export default PromptSidebar