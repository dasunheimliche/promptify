import { AI } from '../types'
import style from '../styles/mainSidebar.module.css'
import { useEffect, useState } from 'react'

const AiButton = ({ai, main, profile, setMain, setShowSS, showSS, setProfile, setLista, setTopic, lista } : any)=> {

    // console.log("MAIN IN BUTTON", main)
    // console.log("AI IN BUTTON", ai)
    // console.log("LISTA IN BUTTON", lista)





    const clickHandler = (ai: AI)=> {
        

        // if (ai.id === main?.id) {
        //     setShowSS(!showSS)
        //     return
        // }

        setMain(ai)
        


        setProfile(false)

        if (showSS && profile) {
            return
        }

        if (showSS && (ai.name !== main?.name)) {
            setLista(undefined)
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