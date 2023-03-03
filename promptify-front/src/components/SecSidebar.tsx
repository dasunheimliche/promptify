import { useState, Dispatch } from 'react'
import { User } from '../types'

interface SecSideBarProps {
    user: User
    main: string
    showSS: boolean
    setUser: Dispatch<User>
    setTopic: Dispatch<string>
    setShowSS: Dispatch<boolean>
    setShowPS: Dispatch<boolean>
}

const SecSidebar = ({user, main, showSS, setTopic, setUser, setShowSS, setShowPS}: SecSideBarProps)=> {
    const [addTopic, setAddTopic] = useState<string>("")
    const [show, setShow] = useState<boolean>(false)

    const loadSections = ()=>{
        const ai = user.allPrompts?.find(ai => ai.name === main)
        return ai?.topics?.map((sec, i)=> <div key={i} className={"ss-ai-topic p"} onClick={()=>setTopic(sec.name)}>{sec.name}</div>)
    }

    const addTopicHandler = (e: React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault()
        let copied: User = JSON.parse(JSON.stringify(user))

        if (copied.allPrompts) {
            let index = copied.allPrompts?.findIndex(ai => ai.name === main)
            copied.allPrompts[index].topics?.push({
                name: addTopic,
                cards: []
            })
            setShow(false)
            setUser(copied)
        }
    }   

    return (
        <div style={!showSS? {display:"none"} : {}} className="second-sidebar">
            <div className="ss-ai-title">{main}</div>
            <div className="ss-add">
                <div className="ss-add-header">
                    <span className="ss-add-title">Topics</span>
                    <button className='ss-add-button' onClick={e=>setShow(!show)}>+</button>
                </div>
                {show && <form className='ss-form' action="" onSubmit={addTopicHandler}>
                    <input placeholder='topic' onChange={e=>setAddTopic(e.target.value)}></input>
                    <button type='submit'>ADD</button>
                </form>}
            </div>
            {loadSections()}
        </div>
    )
}

export default SecSidebar