import { useState, Dispatch } from 'react'

import { AI, User, Mains, Visibility } from '../types'

import { useMutation, useApolloClient } from '@apollo/client'
import { useRouter } from "next/router"
import { ME, GET_AIS,DELETE_AI } from '@/queries'

import DeleteAlert from './DeleteAlert'

import SecSidebarHeader from './SecSidebarHeader'
import Topics from './Topics'
import style from '../styles/secSidebar.module.css'

interface SecSideBarProps {
    me: User | undefined
    mains: Mains
    visibility: Visibility
    aiList: AI[] | undefined
    setMains: Dispatch<Mains>
    setVisibility: Dispatch<Visibility>
} 

const SecSidebar = ({me, mains, aiList, visibility,  setMains, setVisibility}: SecSideBarProps)=> {
    
    const currentAI = aiList?.find((ai:AI)=> ai.id === mains.main?.id)
    
    const [deleteAlert, setDeleteAlert] = useState<string>("none")

    const router = useRouter() 
    const client = useApolloClient()

    // MUTATIONS

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

    // EVENT HANDLERS

    const deleteAifunc = async (userId: string, aiId: string) => {
        try {
            if (!userId || !aiId || !aiList) {
                return;
            }
        
            await deleteAi({ variables: { userId, aiId } });
        
            const newAiList = aiList?.filter((arrayAi) => arrayAi.id !== aiId);
        
            if (newAiList.length === 0) {
                setMains({main: undefined, topic: undefined, currCard: undefined, profile: true})
            } else {
                setMains({...mains, main: newAiList[0]})
                setDeleteAlert("none");
            }
        
        } catch (error) {
            console.error("Error deleting AI:", error);
        }
    };

    const deleteAiHandler = async ()=> {

        if (!currentAI) return
        
        await deleteAifunc(currentAI?.userId, currentAI?.id)
        setDeleteAlert("none")
    }

    const handleSignOff = async()=> {
        sessionStorage.clear()
        await client.resetStore()
        await client.cache.reset()
        router.push("/login")
      }


    return (
        <div style={!visibility.showSS? {} : {}} className={visibility.showSS? style[`second-sidebar`] : `${style['second-sidebar']} ${style['hidden-bar']}`} > 
            {(deleteAlert === "ai") && <DeleteAlert setDeleteAlert={setDeleteAlert} deleteHandler={deleteAiHandler} loading={DAloading} />}
            {mains.profile && 

                <div className={style['profile-card']}>
                    <div className={style['profile-name']}>{me?.name}</div>
                    <button className={style['sign-off']} onClick={handleSignOff} type='button' title='Sign off'>Sign Off</button>
                </div>
            }

            <SecSidebarHeader aiList={aiList} currentAI={currentAI} setDeleteAlert={setDeleteAlert} mains={mains} />
            <Topics 
                key={currentAI?.id}
                mains={mains} 
                setMains={setMains} 
                currentAI={currentAI} 
                setVisibility={setVisibility} 
                visibility={visibility} 
                deleteAlert={deleteAlert} 
                setDeleteAlert={setDeleteAlert} 
            />
        </div>
    )
}

export default SecSidebar