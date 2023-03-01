import { useState, Dispatch } from 'react'
import { User, Prompt, Card } from '../types'

import PromptCard from './PromptCard'
import AddCardButton from './AddCardButton'

interface MainContentGridProps {
    user: User
    main: string
    topic: string
    columns: number
    setShowPS: Dispatch<boolean>
    setUser: Dispatch<User>
    setShowMenu: Dispatch<string>
    setCurrentCard: Dispatch<Card>
}

const MainContentGrid = ({ user, main, topic, columns, setUser, setShowMenu, setCurrentCard, setShowPS }: MainContentGridProps)=> {
    
    const loadPrompts = () => {
        const ai = user.allPrompts?.find(ai => ai.name === main)
        const section = ai?.sections?.find(sec => sec.name === topic)
        return section?.cards?.map((c,i)=> <PromptCard key={i} card={c} setCurrentCard={setCurrentCard} setShowPS={setShowPS}/>).reverse()
    }

    return (
        <div className='wrapper'>
            <div style={{columnCount: `${columns}`}} className="mc-grid">
                {loadPrompts()}
                
            </div>
            {topic !== "none" && <AddCardButton  setShowMenu={setShowMenu}/>}
        </div>
    )
}

export default MainContentGrid