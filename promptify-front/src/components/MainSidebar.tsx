import { useEffect, Dispatch } from 'react'
import { AI, User, Topic } from '../types'
import { GET_AIS } from '@/queries'
import { useQuery } from '@apollo/client';

import AiButton from './AiButton';

import style from '../styles/mainSidebar.module.css'
 
interface MainSideBarProps {
    main: AI | undefined
    showSS: boolean
    me: User | undefined
    aiList: AI[] | undefined
    lista: Topic[] | undefined
    profile: boolean
    setMain: Dispatch<AI>
    setAiList: Dispatch<AI[]>
    setShowMenu: Dispatch<string>
    setShowSS: Dispatch<boolean>
    setProfile: Dispatch<boolean>
    setLista: Dispatch<Topic[] | undefined>
    setTopic: Dispatch<Topic | undefined>
}

interface aiListData {
    getAis: AI[]
}

interface aiListVariables {
    meId: string | undefined
}



const MainSidebar = ({ aiList, main, showSS, me, profile, lista, setMain, setShowMenu, setShowSS, setAiList, setProfile, setLista, setTopic}: MainSideBarProps)=> {

    const { loading: aiLoading, error: aiError, data: aiData, refetch: aiRefetch } = useQuery<aiListData, aiListVariables>(GET_AIS, {
        variables: {meId: me?.id}
    });
    
    useEffect(()=> {
        if (aiData?.getAis) {
            setAiList(aiData?.getAis)
        }
    }, [aiData]) // eslint-disable-line

    const refff = async()=> {
        aiRefetch()
    }

    useEffect(()=> {

        refff()
    }, [me]) // eslint-disable-line


    
    // EVENT HANDLERS
    const loadAIs = ()=> {
        if (!aiList) {
            return
        }
        const newAiList = aiList.filter(ai=> ai.fav !== true)
        return newAiList?.map((ai: AI) => <AiButton main={main} profile={profile} lista={lista} setProfile={setProfile} setMain={setMain} setShowSS={setShowSS} showSS={showSS} key={ai.id} ai={ai} setLista={setLista} setTopic={setTopic}/>)
    }

    const loadFavAis = ()=> {
        if (!aiList) {
            return
        }
        const newAiList = aiList?.filter(ai => ai.fav === true)
        return newAiList?.map((ai: AI) => <AiButton main={main} profile={profile} lista={lista} setProfile={setProfile} setMain={setMain} setShowSS={setShowSS} showSS={showSS} key={ai.id} ai={ai} setLista={setLista} setTopic={setTopic}/>)
    }

    const openPanel = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=> {
        e.preventDefault()
        setShowMenu("add ai")
    }

    const theresfavs = ()=> {
        return aiList?.some(ai => ai.fav)
    }

    const toProfile = ()=> {

        if (profile && showSS) {
            setProfile(false)
            setShowSS(false)
        }

        if (showSS) {
            setProfile(true)
        }

        if (!showSS) {
            setShowSS(true)
            setProfile(true)
        }
    }
    
    return(
        <div className={style[`main-sidebar`]}>
            <div className={`${style.logo} p`}>Pfy</div>
            <div className={(profile && showSS)? `${style[`add-ai`]} ${style['selected-me']} p` :`${style[`add-ai`]} p`} onClick={toProfile}>ME</div>
            {(aiList && aiList.length > 0) && <div className={style[`ais-wrapper`]}>
                {theresfavs() && 
                    <div className={style['favs-container']}>
                        <div className={style['fav-ais']}></div>
                        <div className={style[`ai-logos`]}>{loadFavAis()}</div>
                    </div>
                }
                <div className="divisor"></div>
                <div className={style[`ai-logos`]}>{loadAIs()}</div>
            </div>}
            <div className={`${style[`add-ai`]} p`} onClick={openPanel}>+</div>
        </div>
    )
}

export default MainSidebar;