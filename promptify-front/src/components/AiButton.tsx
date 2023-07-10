import { AI, Mains, Visibility } from '../types'
import style from '../styles/mainSidebar.module.css'
import { Dispatch } from 'react'

interface AiButtonProps {
    ai: AI
    mains: Mains
    visibility: Visibility
    setMains: Dispatch<Mains>
    setVisibility: Dispatch<Visibility>
}

const AiButton = ({ai, mains, setMains, setVisibility, visibility } : AiButtonProps)=> {

    const clickHandler = (ai: AI)=> {

        setMains({...mains, main: {id: ai.id}, profile: false})

        if (visibility.showSS && mains.profile) {
            return
        }

        if (visibility.showSS && (ai.id !== mains.main?.id)) {
            return
        }

        if (visibility.showSS && (ai.id === mains.main?.id)) {
            setVisibility({...visibility, showSS: false})
            return
        }

        if (!visibility.showSS) {
            setVisibility({...visibility, showSS: true})
        }
    }

    return(
        <div  className={(mains.main?.id && ai.id === mains.main.id)? `${style[`ai-logo`]} p ${style['selected-main']}` : `${style[`ai-logo`]} p` } onClick={()=>clickHandler(ai)}>{ai.abb}</div>
    )
}

export default AiButton