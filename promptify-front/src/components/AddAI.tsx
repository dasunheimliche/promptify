import { useState, Dispatch } from 'react'
import { User, AI } from '../types'
import { useMutation } from '@apollo/client';

import { ADD_AI } from '@/queries'

interface AddAIProps {
    me: User | undefined
    aiList: AI[] | undefined
    setShowMenu: Dispatch<string>
    setAiList: Dispatch<AI[]>
    setMain: Dispatch<AI>
}

interface addAiData {
    createAi : AI
}
interface addAiVariables {
    userId: string
    ai: {
        name: string
        abb: string
    }
}

const AddAI = ({ me, aiList, setAiList, setShowMenu, setMain } : AddAIProps)  => {

    // STATES
    const [name, setName] = useState<string>("")
    const [abb, setAbb] = useState<string>("")

    // MUTATIONS
    const [ createAi, { error, data } ] = useMutation<addAiData, addAiVariables>(ADD_AI)

    // EVENT HANDLERS
    const closePanel = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=> {
        e.preventDefault()
        setShowMenu("none")
    }

    const addAI = async (e: React.FormEvent<HTMLDivElement>)=> {
        e.preventDefault()

        if (!me || !aiList) {
            return
        }

        const variables = {userId: me.id, ai: {name, abb}}
        const newAI = await createAi({variables: variables})

        if (!newAI.data) {
            return
        }

        let copia : AI[] = [...aiList, newAI.data.createAi]

        setAiList(copia)
        setMain(newAI.data.createAi)
        setShowMenu("none")
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