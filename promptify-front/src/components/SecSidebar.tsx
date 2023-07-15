import { Dispatch } from 'react'

import { AI, User, Mains, Visibility } from '../types'

import { useApolloClient } from '@apollo/client'
import { useRouter } from "next/router"

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
        
    const router = useRouter() 
    const client = useApolloClient()


    // EVENT HANDLERS

    const handleSignOff = async()=> {
        sessionStorage.clear()
        await client.resetStore()
        await client.cache.reset()
        router.push("/login")
    }


    return (
        <div className={visibility.showSS? style[`second-sidebar`] : `${style['second-sidebar']} ${style['hidden-bar']}`} > 

            {mains.profile && 

                <div className={style['profile-card']}>
                    <div className={style['profile-name']}>{me?.name}</div>
                    <button className={style['sign-off']} onClick={handleSignOff} type='button' title='Sign off'>Sign Off</button>
                </div>
            }

            <SecSidebarHeader me={me} aiList={aiList} mains={mains} setMains={setMains}/>
            <Topics 
                key={mains.main?.id}
                mains={mains} 
                setMains={setMains} 
                setVisibility={setVisibility} 
                visibility={visibility} 
            />
        </div>
    )
}

export default SecSidebar