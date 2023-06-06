import { AI } from '../types'
import style from '../styles/mainSidebar.module.css'

const AiButton = ({ai, mains, setMains, setVisibility, visibility, setTopicList } : any)=> {

    const clickHandler = (ai: AI)=> {

        setMains({...mains, main: ai, profile: false})

        if (visibility.showSS && mains.profile) {
            return
        }

        if (visibility.showSS && (ai.name !== mains.main?.name)) {
            setTopicList(undefined)
            return
        }

        if (visibility.showSS && (ai.name === mains.main?.name)) {
            setVisibility({...visibility, showSS: false})
            return
        }

        if (!visibility.showSS) {
            setVisibility({...visibility, showSS: true})
        }
    }

    return(
        <div  className={(mains.main && ai.id === mains.main.id)? `${style[`ai-logo`]} p ${style['selected-main']}` : `${style[`ai-logo`]} p` } onClick={()=>clickHandler(ai)}>{ai.abb}</div>
    )
}

export default AiButton