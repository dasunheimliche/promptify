import { useEffect, Dispatch } from 'react'

import { AI, User, Topic, Mains } from '../types'

import { GET_AIS } from '@/queries'
import { useQuery } from '@apollo/client';

import AiButton from './AiButton';

import style from '../styles/mainSidebar.module.css'
 
interface MainSideBarProps {
    mains: Mains
    showSS: boolean
    me: User | undefined
    aiList: AI[] | undefined
    topicList: Topic[] | undefined
    setMains: Dispatch<Mains>
    setAiList: Dispatch<AI[]>
    setShowMenu: Dispatch<string>
    setShowSS: Dispatch<boolean>
    setTopicList: Dispatch<Topic[] | undefined>
}

interface aiListData {
    getAis: AI[]
}

interface aiListVariables {
    meId: string | undefined
}



const MainSidebar = ({ aiList, mains, showSS, me, topicList, setMains, setShowMenu, setShowSS, setAiList, setTopicList}: MainSideBarProps)=> {

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
        return newAiList?.map((ai: AI) => <AiButton mains={mains} topicList={topicList} setMains={setMains} setShowSS={setShowSS} showSS={showSS} key={ai.id} ai={ai} setTopicList={setTopicList} />)
    }

    const loadFavAis = ()=> {
        if (!aiList) {
            return
        }
        const newAiList = aiList?.filter(ai => ai.fav === true)
        return newAiList?.map((ai: AI) => <AiButton mains={mains} topicList={topicList} setMains={setMains} setShowSS={setShowSS} showSS={showSS} key={ai.id} ai={ai} setTopicList={setTopicList} />)
    }

    const openPanel = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=> {
        e.preventDefault()
        setShowMenu("add ai")
    }

    const theresfavs = ()=> {
        return aiList?.some(ai => ai.fav)
    }

    const toProfile = ()=> {

        if (mains.profile && showSS) {
            setMains({...mains, profile: false})
            setShowSS(false)
        }

        if (showSS) {
            setMains({...mains, profile: true})
        }

        if (!showSS) {
            setShowSS(true)
            setMains({...mains, profile: true})
        }
    }
    
    return(
        <div className={style[`main-sidebar`]}>
            <div className={`${style.logo} p`}>Pfy</div>
            <div className={(mains.profile && showSS)? `${style[`add-ai`]} ${style['selected-me']} p` :`${style[`add-ai`]} p`} onClick={toProfile}>ME</div>
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