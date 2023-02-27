import { useState, Dispatch } from 'react'
import { User } from '../types'

interface AddAIProps {
    user: User
    setUser: Dispatch<User>
    setShowMenu: Dispatch<string>
}


const AddAI = ({user, setUser, setShowMenu} : AddAIProps)  : JSX.Element => {

    const [name, setName] = useState<string>("")
    const [abb, setAbb] = useState<string>("")

    const closePanel = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=> {
        e.preventDefault()
        setShowMenu("none")
    }

    const addAI = (e: React.FormEvent<HTMLDivElement>)=> {
        e.preventDefault()
        let copied: User = JSON.parse(JSON.stringify(user))
        copied.allPrompts?.push({
            name,
            abb,
            sections: []
        })
        setShowMenu("none")
        setUser(copied)
    }

    return (
        <div className="menu-panel" onSubmit={addAI}>
            <form action="" className="menu-panel-form ">
                <label className="menu-title">{"AI's name:"}</label>
                <input type="text" placeholder="name" onChange={e=> setName(e.target.value)}/>

                <label className="menu-title">{"AI's abb:"}</label>
                <input type="text" placeholder="abb" onChange={e=> setAbb(e.target.value)}/>

                <div className="menu-buttons">
                    <button type="submit">Enviar</button>
                    <button onClick={closePanel}>Cerrar</button>
                </div>
            </form>
        </div>
    )
}

export default AddAI