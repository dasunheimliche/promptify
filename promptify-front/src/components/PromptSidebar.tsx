import { useEffect, useState, Dispatch } from 'react'
import { Prompt } from '../types'

interface PromptSidebarProps {
    currPrompt: Prompt
    showPS: boolean
    setShowPS: Dispatch<boolean>
}


const PromptSidebar = ({currPrompt, showPS, setShowPS} : PromptSidebarProps)=> {

    const [p, setP] = useState<Prompt>(currPrompt)

    useEffect(()=> {
        setP(currPrompt)
    }, [currPrompt])

    const restart = ()=> {
        setP(currPrompt)
    }

    const copy = ()=> {
        if (typeof p.content === "string") {
            navigator.clipboard.writeText(p.content)
        }
    }

    const close = ()=> {
        setShowPS(false)
    }

    if (typeof p.content === "string") {
        return (
            <div className='prompt-sidebar'>
                <div className='ps-header'>
                <span className='ps-back-button p' onClick={close}></span>
                    <div className="ps-buttons">
                        <div className="ps-button p" onClick={restart}>RESTART</div>   
                        <div className="ps-button p" onClick={copy}>COPY</div>
                 </div>
                </div>
                <div className="ps-content">
                    <div className="ps-content-title">{currPrompt?.title}</div>
                    <textarea className='ps-content-textarea' placeholder='prompt' value={p.content} onChange={e=> setP({...p, content: e.target.value})} spellCheck="false"></textarea>
                </div>
            </div>
        )
    }

    return (
        <div></div>
    )
    
}

export default PromptSidebar