import { AI } from '../types'
import style from '../styles/mainSidebar.module.css'

const AiButton = ({ai, main, profile, setMain, setShowSS, showSS, setProfile, setTopicList } : any)=> {

    const clickHandler = (ai: AI)=> {

        setMain(ai)
        setProfile(false)

        if (showSS && profile) {
            return
        }

        if (showSS && (ai.name !== main?.name)) {
            setTopicList(undefined)
            return
        }

        if (showSS && (ai.name === main?.name)) {
            setShowSS(false)
            return
        }

        if (!showSS) {
            setShowSS(true)
        }
    }

    return(
        <div  className={(main && ai.id === main.id)? `${style[`ai-logo`]} p ${style['selected-main']}` : `${style[`ai-logo`]} p` } onClick={()=>clickHandler(ai)}>{ai.abb}</div>
    )
}

export default AiButton