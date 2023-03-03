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

    const closePanel = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=> {
        e.preventDefault()
        setShowMenu("none")
    }

    const addPrompt = (e: React.FormEvent<HTMLDivElement>)=> {
        e.preventDefault()
        let copied: User = JSON.parse(JSON.stringify(user))

        if (copied.allPrompts) {
            let indexAI = copied.allPrompts?.findIndex(ai => ai.name === main)
            let indexSec = copied.allPrompts[indexAI].topics?.findIndex(sec => sec.name === topic)
            copied.allPrompts[indexAI].topics![indexSec!].cards?.push({
                title,
                prompts: [{id: 1, title: "", content: content}]
            })
            setUser(copied)
        }
        
    }

    return (
        <div className="menu-panel" onSubmit={addPrompt}>
            <div className="mp-header">
                <div className="mp-header-title">Add a Prompt</div>
                <div className="mp-header-close p" onClick={closePanel}>x</div>
            </div>
            <form action="" className="menu-panel-form ">
                <label className="menu-title">{"Title"}</label>
                <input type="text" placeholder="title" onChange={e=> setName(e.target.value)}/>

                <label className="menu-title">{"Prompt"}</label>
                <textarea value={content} placeholder="Write your prompt" onChange={e=> setContent(e.target.value)}/>

                <div className="menu-buttons">
                    <button type="submit">Add Prompt</button>
                </div>
            </form>
        </div>
    )
}

export default AddPrompt