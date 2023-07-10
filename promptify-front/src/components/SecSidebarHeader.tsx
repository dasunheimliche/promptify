import style from '../styles/secSidebar.module.css'

import { useMutation } from '@apollo/client';
import { useState, useEffect, useRef, Dispatch } from 'react';

import { EDIT_AI, ADD_AI_FAV, GET_AIS, DELETE_AI, ME } from '@/queries';
import { doNothing } from '@/utils/functions';

import { AI, Mains, User } from '@/types';

import DeleteAlert from './DeleteAlert';

interface SecSidebarHeaderProps {
    me: User | undefined
    aiList: AI[] | undefined
    mains: Mains
    setMains: Dispatch<Mains>
}

const SecSidebarHeader = ({ me, aiList, mains, setMains } : SecSidebarHeaderProps)=> {

    const currentAI = aiList?.find((ai:AI)=> ai.id === mains.main?.id)

    const [edit,        setEdit       ] = useState<boolean>(false) 
    const [newTitle,    setNewTitle   ] = useState<string | undefined>(currentAI?.name)
    const [del,         setDel        ] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

    const [ addAiToFavs,    {loading: AATFloading} ] = useMutation(ADD_AI_FAV);
    const [ editAi,         {loading: EAloading}   ] = useMutation(EDIT_AI)
    const [ deleteAi,       {loading: DAloading}   ] = useMutation(DELETE_AI, {
        update: (cache, response) => {
            cache.updateQuery({ query: ME }, ({ me } ) => {
                const newList = me.allPrompts.filter((id:string) => id !== response.data.deleteAi)
                const newME = {...me}
                newME.allPrompts = newList
                return {
                    me: newME
              }
            });
            cache.updateQuery({ query: GET_AIS, variables: {meId: me?.id} }, ({getAis}) => {
                return {
                    getAis: getAis.filter((ai: AI)=> ai.id !== response.data.deleteAi)
              }
            });
        }
    })


    const addToFavs = async () => {
        try {

            if (!currentAI) {
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

            if (!currentAI || !newTitle) {
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

    const deleteAifunc = async (userId: string, aiId: string) => {
        try {
            if (!userId || !aiId || !aiList) {
                return;
            }
        
            await deleteAi({ variables: { userId, aiId } });
        
            const newAiList = aiList?.filter((arrayAi: AI) => arrayAi.id !== aiId);
        
            if (newAiList.length === 0) {
                setMains({main: undefined, topic: undefined, currCard: undefined, profile: true})
            } else {
                setMains({...mains, main: {id : newAiList[0].id}})
            }
        
        } catch (error) {
            console.error("Error deleting AI:", error);
        }
    };

    const deleteAiHandler = async ()=> {

        if (!currentAI) return
        
        await deleteAifunc(currentAI?.userId, currentAI?.id)

        setDel(false)
    }

    useEffect(()=> {
        inputRef.current?.focus()
    },[edit])

    if (mains.profile) return null

    return(
        <div className={style[`ai-container`]}>
            {del && <DeleteAlert onAccept={deleteAiHandler} onCancel={setDel} loading={DAloading} />}
            {!edit && <div className={style[`ai-title`]}>{currentAI && currentAI.name}</div>}
            {edit && <input ref={inputRef} type={"text"} value={newTitle} placeholder={"edit name"} className={`${style[`ai-title`]} unset`} onChange={(e)=>setNewTitle(e.target.value)} minLength={1}></input>}
            {currentAI && 
                <div className={style[`ai-opt`]}>
                    {!edit && <div className={`${style[`del-ai`]} p`} onClick={()=>setDel(true)}></div> }
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