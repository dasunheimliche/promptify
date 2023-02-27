import { useState, Dispatch } from 'react'
import { User, Prompt } from '../types'

import PromptCard from './PromptCard'

interface MainContentGridProps {
    user: User
    main: string
    topic: string
    columns: number
    setShowPS: Dispatch<boolean>
    setUser: Dispatch<User>
    setShowMenu: Dispatch<string>
    setCurrentPromt: Dispatch<Prompt>
}

const MainContentGrid = ({ user, main, topic, columns, setUser, setShowMenu, setCurrentPromt, setShowPS }: MainContentGridProps)=> {
    
    const loadPropts = () => {
        const ai = user.allPrompts?.find(ai => ai.name === main)
        const section = ai?.sections?.find(sec => sec.name === topic)
        return section?.prompts?.map((p,i)=> <PromptCard key={i} prompt={p} setCurrentPromt={setCurrentPromt} setShowPS={setShowPS}/>)
    }

    return (
        <div className='wrapper'>
            <div style={{columnCount: `${columns}`}} className="mc-grid">
                {loadPropts()}
                
            </div>
            {topic !== "none" && <div className='add-prompt p' onClick={()=>setShowMenu("add prompt")}>+</div>}
        </div>
    )
}

export default MainContentGrid