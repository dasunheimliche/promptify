import { AI } from '../types'
import style from '../styles/mainSidebar.module.css'

const AiButton = ({ai, mains, setMains, setShowSS, showSS, setTopicList } : any)=> {

    const clickHandler = (ai: AI)=> {

        setMains({...mains, main: ai, profile: false})

        if (showSS && mains.profile) {
            return
        }

        if (showSS && (ai.name !== mains.main?.name)) {
            setTopicList(undefined)
            return
        }

        if (showSS && (ai.name === mains.main?.name)) {
            setShowSS(false)
            return
        }

        if (!showSS) {
            setShowSS(true)
        }
    }

    return(
        <div  className={(mains.main && ai.id === mains.main.id)? `${style[`ai-logo`]} p ${style['selected-main']}` : `${style[`ai-logo`]} p` } onClick={()=>clickHandler(ai)}>{ai.abb}</div>
    )
}

export default AiButton