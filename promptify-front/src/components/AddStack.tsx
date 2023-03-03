import { useState, Dispatch, useRef } from 'react'
import { User, Prompt } from '../types'

interface AddPromptProps {
    user: User
    setUser: Dispatch<User>
    setShowMenu: Dispatch<string>
    main: string
    topic: string
}

const AddStack = ({user, main, topic, setUser, setShowMenu} : AddPromptProps)=> {

    const [stackTitle, setStackTitle] = useState<string>("")
    const [count, setCount] = useState<number>(0)

    const [stack, setStack] = useState<Prompt[] | undefined>([])
    const [promptTitle, setPromptTitle] = useState<string>("")
    const [promptContent, setPromptContent] = useState<string>("")

    const closePanel = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=> {
        e.preventDefault()
        setShowMenu("none")
    }

    const addToStack = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=> {
        e.preventDefault()
        setCount(count + 1)
        let newPrompt: Prompt = {id: count + 1, title: promptTitle, content: promptContent}
        if (stack) {
            setStack( [...stack, newPrompt])
        } else {
            setStack([newPrompt])
        }
        setPromptTitle("")
        setPromptContent("")
    }

    const addPrompt = (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault()
        let copied: User = JSON.parse(JSON.stringify(user))

        if (!stack) {
            return
        }

        if (copied.allPrompts) {
            let indexAI = copied.allPrompts?.findIndex(ai => ai.name === main)
            let indexSec = copied.allPrompts[indexAI].topics?.findIndex(sec => sec.name === topic)
            copied.allPrompts[indexAI].topics![indexSec!].cards?.push({
                title: stackTitle,
                prompts: stack
            })
            setUser(copied)
        }

    }

    return (
        <div className="menu-panel" onSubmit={addPrompt}>
            <div className="mp-header">
                <div className="mp-header-title">Add a Stack</div>
                <div className="mp-header-close p" onClick={closePanel}>x</div>
            </div>
            <form action="" className="menu-panel-form ">
                <label className="menu-title">{"Stack Title"}</label>
                <input type="text" placeholder=" stack title" onChange={ e=> setStackTitle(e.target.value)}/>

                <div className='mp-stack-header'>
                    <label className="menu-title">{`Prompt Stack: ${count}`}</label>
                    <button onClick={addToStack}>+ Add to Stack</button>
                </div>
                <input value={promptTitle} type="text" placeholder="prompt title" onChange={e=> setPromptTitle(e.target.value)}/>
                <textarea value={promptContent} placeholder="Write your prompt" onChange={e=> setPromptContent(e.target.value)}/>

                <div className="menu-buttons">
                    <button type="submit">Add Prompt</button>
                </div>
            </form>
        </div>
    )
}

export default AddStack