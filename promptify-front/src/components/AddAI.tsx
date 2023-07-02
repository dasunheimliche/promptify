import { useState, Dispatch } from 'react'

import { User, AI, Mains, Visibility } from '../types'
import { doNothing, closePopUp } from '@/utils/functions';

import { useMutation } from '@apollo/client';
import { ADD_AI, GET_AIS, ME } from '@/queries'

import style from '../styles/popups.module.css'

interface AddAIProps {
    me            : User | undefined
    aiList        : AI[] | undefined
    setVisibility : React.Dispatch<React.SetStateAction<Visibility>>
    setAiList     : Dispatch<AI[]>
    setMains      : React.Dispatch<React.SetStateAction<Mains>>
    // setMe         : Dispatch<User>
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

const AddAI = ({me, aiList, setAiList, setVisibility, setMains } : AddAIProps)  => {

    //** STATES
    const [name, setName] = useState<string>("")
    const [abb,  setAbb ] = useState<string>("")

    //** MUTATIONS
    const [ createAi, { loading } ] = useMutation<addAiData, addAiVariables>(ADD_AI, {
        update: (cache, response) => {
            cache.updateQuery({ query: ME }, ({ me } ) => {
                return {
                    me: me.allPrompts.concat(response.data?.createAi.id),
              }
            });
        }
    })

    //** EVENT HANDLERS

    const addAI = async (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault();
    
        if (!me) {
            return;
        }
    
        const variables = {
            userId: me.id,
            ai: { name, abb },
        };
    
        try {
            const { data: newAI } = await createAi({ variables });
        
            if (newAI) {
                const updatedAiList: AI[] = aiList ? [...aiList, newAI.createAi] : [newAI.createAi];
        
                const updatedMe: User = { ...me };
                updatedMe.allPrompts = updatedMe.allPrompts?.concat(newAI.createAi.id);
        
                // setMe(updatedMe);
                setAiList(updatedAiList);
                setMains(prev=>({...prev, main: newAI.createAi}))
                setVisibility(prev=>({...prev, showMenu: "none"}))
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={style.popup} onSubmit={loading? doNothing : addAI}>
            <form action="" className={style.form}>
                <label className={style.title}>{"AI's name:"}</label>
                <input type="text" placeholder="name" onChange={e=> setName(e.target.value)} minLength={1} required/>

                <label className={style.title}>{"AI's abb:"}</label>
                <input type="text" placeholder="abb"  onChange={e=> setAbb(e.target.value)} maxLength={5} required/>

                <div className={style.buttons}>
                    <button type="submit">Enviar</button>
                    <button onClick={e=>closePopUp(e, setVisibility)}>Cerrar</button>
                </div>
            </form>
        </div>
    )
}

export default AddAI