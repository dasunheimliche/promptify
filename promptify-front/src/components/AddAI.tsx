import { useState, Dispatch } from 'react'
import { User, AI } from '../types'
import { useMutation } from '@apollo/client';

import { ADD_AI } from '@/queries'
import style from '../styles/popups.module.css'

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
    const [ createAi, { data, loading, error } ] = useMutation<addAiData, addAiVariables>(ADD_AI)

    console.log("LOADING MUTATION", loading, error)


    // EVENT HANDLERS
    const closePanel = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=> {
        e.preventDefault()
        setShowMenu("none")
    }

    const addAI = async (e: React.FormEvent<HTMLDivElement>)=> {
        e.preventDefault()
        if (!me) {
            return
        }

        const variables = {userId: me.id, ai: {name, abb}}
        const newAI = await createAi({variables: variables})
        console.log("NEW AI", newAI)

        if (!newAI.data) {
            return
        }

        let copia : AI[]

        if (aiList) {
            copia = [...aiList, newAI.data.createAi]
        } else {
            copia = [newAI.data.createAi]
        }

        setAiList(copia)
        setMain(newAI.data.createAi)
        setShowMenu("none")
    }

    const doNothing = (e: React.FormEvent<HTMLDivElement>)=> {
        e.preventDefault()
    }

    return (
        <div className={style.popup} onSubmit={loading? doNothing : addAI}>
            <form action="" className={style.form}>
                <label className={style.title}>{"AI's name:"}</label>
                <input type="text" placeholder="name" onChange={e=> setName(e.target.value)}/>

                <label className={style.title}>{"AI's abb:"}</label>
                <input type="text" placeholder="abb" onChange={e=> setAbb(e.target.value)} maxLength={5}/>

                <div className={style.buttons}>
                    <button type="submit">Enviar</button>
                    <button onClick={closePanel}>Cerrar</button>
                </div>
            </form>
        </div>
    )
}

export default AddAI