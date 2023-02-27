import { useState, Dispatch } from 'react'
import { Prompt } from '../types'

interface PromptProps {
    prompt: Prompt
    setCurrentPromt: Dispatch<Prompt>
    setShowPS: Dispatch<boolean>
}

const Prompt = ({prompt, setCurrentPromt, setShowPS} : PromptProps)=> {

    const clickHandler = ()=> {
        setCurrentPromt(prompt)
        setShowPS(true)
    }

    if (typeof prompt.content === "string") {
        return (
            <div className="prompt p" onClick={clickHandler}>
                <div className="prompt-title">{prompt.title}</div>
                <div className="prompt-content">{prompt.content}</div>
            </div>
        )
    }

    return (
        <div className="test">HOLA</div>
    )
}

export default Prompt