import { useState, Dispatch, useRef } from 'react'
import { User } from '../types'

interface AddPromptProps {
    user: User
    setUser: Dispatch<User>
    setShowMenu: Dispatch<string>
    main: string
    topic: string
}

const AddPrompt = ({user, main, topic, setUser, setShowMenu} : AddPromptProps)=> {

    const [title, setName] = useState<string>("")
    const [content, setContent] = useState<string>("")

    const closePanel = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=> {
        e.preventDefault()
        setShowMenu("none")
    }

    const addAI = (e: React.FormEvent<HTMLDivElement>)=> {
        e.preventDefault()
        let copied: User = JSON.parse(JSON.stringify(user))

        if (copied.allPrompts) {
            let indexAI = copied.allPrompts?.findIndex(ai => ai.name === main)
            let indexSec = copied.allPrompts[indexAI].sections?.findIndex(sec => sec.name === topic)
            copied.allPrompts[indexAI].sections![indexSec!].prompts?.push({
                id: 10,
                title,
                content
            })
            setUser(copied)
        }
        
    }

    return (
        <div className="menu-panel" onSubmit={addAI}>
            <form action="" className="menu-panel-form ">
                <label className="menu-title">{"Title"}</label>
                <input type="text" placeholder="title" onChange={e=> setName(e.target.value)}/>

                <label className="menu-title">{"Prompt"}</label>
                <textarea value={content} placeholder="Write your prompt" onChange={e=> setContent(e.target.value)}/>

                <div className="menu-buttons">
                    <button type="submit">Enviar</button>
                    <button onClick={closePanel}>Cerrar</button>
                </div>
            </form>
        </div>
    )
}

export default AddPrompt