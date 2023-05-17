import { AI } from '../types'
import style from '../styles/mainSidebar.module.css'

const AiButton = ({ai, main, profile, setMain, setShowSS, showSS, setProfile, setLista, setTopic, lista } : any)=> {

    const clickHandler = (ai: AI)=> {
        // console.log("CLICKED AI")
        setMain(ai)
        setProfile(false)
        console.log("LISTAAAA EN AI BUTTON", lista)

        // if (lista) {
        //     setTopic(lista[0])
        // }

        // if (!main || !ai) {
        //     return null
        // }

        if (showSS && profile) {
            // setProfile(false)
            return
        }

        if (showSS && (ai.name !== main.name)) {
            setLista(undefined)
            // setProfile(false)
            return
        }

        if (showSS && (ai.name === main.name)) {
            // setProfile(false)
            setShowSS(false)
            return
        }

        if (!showSS) {
            // setProfile(false)
            setShowSS(true)
        }

        // if (ai.name === main.name && !profile) {
        //     setShowSS(!showSS)
        // } else {
        //     setShowSS(true)
        // }
        
        // refetch()

    }

    return(
        <div  className={ai.id === main.id? `${style[`ai-logo`]} p ${style['selected-main']}` : `${style[`ai-logo`]} p` } onClick={()=>clickHandler(ai)}>{ai.abb}</div>
    )
}

export default AiButton