import style from '../styles/secSidebar.module.css'

import { useMutation } from '@apollo/client';
import { useState, useEffect, useRef } from 'react';

import { EDIT_AI, ADD_AI_FAV } from '@/queries';
import { doNothing } from '@/utils/functions';

const SecSidebarHeader = ({ aiList, currentAI, setDeleteAlert, mains } : any)=> {

    const [edit,        setEdit       ] = useState<boolean>(false) 
    const [newTitle,    setNewTitle   ] = useState<string | undefined>(currentAI?.name)

    const inputRef = useRef<HTMLInputElement>(null)

    const [ addAiToFavs,    {loading: AATFloading} ] = useMutation(ADD_AI_FAV);
    const [ editAi,         {loading: EAloading}   ] = useMutation(EDIT_AI)

    const addToFavs = async () => {
        try {

            if (!aiList || !currentAI) {
                return;
            }
        
            await addAiToFavs({ variables: { aiId: currentAI?.id }});

        } catch (error) {
            console.error('An error occurred while adding to favorites:', error);
        }
    };

    const setEditHandler = ()=> {
        setEdit(!edit)
    }

    const editAiHandler = async () => {
        try {

            if (!aiList || !currentAI || !newTitle) {
                return;
            }

            if (currentAI?.name === newTitle) {
                setEdit(!edit);
                return;
            }
        
            await editAi({ variables: { aiId: currentAI?.id, newName: newTitle } });

            setEdit(!edit);
        } catch (error) {
            console.error('An error occurred while editing AI:', error);
        }
    };


    useEffect(()=> {
        inputRef.current?.focus()
    },[edit])

    if (mains.profile) return null

    return(
        <div className={style[`ai-container`]}>

            {!edit && <div className={style[`ai-title`]}>{currentAI && currentAI.name}</div>}
            {edit && <input ref={inputRef} type={"text"} value={newTitle} placeholder={"edit name"} className={`${style[`ai-title`]} unset`} onChange={(e)=>setNewTitle(e.target.value)} minLength={1}></input>}
            {currentAI && 
                <div className={style[`ai-opt`]}>
                    {!edit && <div className={`${style[`del-ai`]} p`} onClick={()=>setDeleteAlert("ai")}></div> }
                    {!edit && <div className={`${style[`edit-ai`]} p`} onClick={setEditHandler}></div>}
                    {!edit && <div className={currentAI?.fav? `${style[`fav-ai`]} ${style[`fav-ai-on`]} p` : `${style[`fav-ai`]} p` } onClick={AATFloading? doNothing : addToFavs}></div>}

                    {edit  && <div className={`${style.yes} p`} onClick={EAloading? doNothing : editAiHandler}>✓</div>}
                    {edit  && <div className={`${style.not} p`} onClick={()=>setEdit(!edit)}>✕</div>}
                </div>
            }
        </div>
    )
}

export default SecSidebarHeader