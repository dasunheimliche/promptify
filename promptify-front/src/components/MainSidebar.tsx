import { useState, Dispatch } from 'react'
import { User } from '../types'
 
interface MainSideBarProps {
    user: User
    main: string
    showSS: boolean
    setMain: Dispatch<string>
    setShowMenu: Dispatch<string>
    setShowSS: Dispatch<boolean>
}

const MainSidebar = ({ user, main, showSS, setMain, setShowMenu, setShowSS}: MainSideBarProps)=> {

    const loadAIs = ()=> {

        const clickHandler = (ainame: string)=> {
            setMain(ainame)
            if (ainame === main) {
                setShowSS(!showSS)
            }
            
        }

        const AIs = user.allPrompts
        return AIs?.map((ai, i) => <div key={i} className={"ms-ai-logo p"} onClick={()=>clickHandler(ai.name)}>{ai.abb}</div>)
    }

    const openPanel = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=> {
        e.preventDefault()
        setShowMenu("add ai")
    }

    return(
        <div className="main-sidebar">
            <div className="ms-logo p">Pfy</div>
            <div className='ms-ai-logos'>{loadAIs()}</div>
            <div className='ms-add-ai p' onClick={openPanel}>+</div>
        </div>
    )
}

export default MainSidebar;