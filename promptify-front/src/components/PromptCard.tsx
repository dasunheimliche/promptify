import { Dispatch } from 'react'
import { Prompt, Card } from '../types'

interface PromptProps {
    card: Card
    setCurrentCard: Dispatch<Card>
    setShowPS: Dispatch<boolean>
}

const PromptCard = ({card, setCurrentCard, setShowPS} : PromptProps)=> {

    const clickHandler = ()=> {
        setCurrentCard(card)
        setShowPS(true)
    }

    return (
        <div className={card.prompts.length > 1? "prompt stack p" : "prompt p"} onClick={clickHandler}>
            <div className="prompt-title">{card.prompts.length > 1? card.title: card.prompts[0].title}</div>
            <div className="prompt-content">{card.prompts[0].content}</div>
        </div>
    )
}

export default PromptCard