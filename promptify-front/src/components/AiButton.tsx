import { AI } from '../types'
import style from '../styles/mainSidebar.module.css'

const AiButton = ({ai, main, setMain, setShowSS, showSS, refetch } : any)=> {

    const clickHandler = (ai: AI)=> {
        // console.log("CLICKED AI")

        setMain(ai)

        if (!main || !ai) {
            return null
        }

        if (ai.name === main.name) {
            setShowSS(!showSS)
        } else {
            setShowSS(true)
        }
        
        refetch()

    }

    return(
        <div  className={style[`ai-logo`]} onClick={()=>clickHandler(ai)}>{ai.abb}</div>
    )
}

export default AiButton