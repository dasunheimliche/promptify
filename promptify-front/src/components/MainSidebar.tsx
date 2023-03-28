import { useEffect, Dispatch } from 'react'
import { AI, User } from '../types'
import { GET_AIS } from '@/queries'
import { useQuery } from '@apollo/client';

import AiButton from './AiButton';

import style from '../styles/mainSidebar.module.css'
 
interface MainSideBarProps {
    main: AI | undefined
    showSS: boolean
    me: User | undefined
    aiList: AI[] | undefined
    setMain: Dispatch<AI>
    setAiList: Dispatch<AI[]>
    setShowMenu: Dispatch<string>
    setShowSS: Dispatch<boolean>
}

interface aiListData {
    getAis: AI[]
}
interface aiListVariables {
    list: string[] | undefined
}

const MainSidebar = ({ aiList, setAiList, main, showSS, me, setMain, setShowMenu, setShowSS}: MainSideBarProps)=> {

    const { loading: aiLoading, error: aiError, data: aiData, refetch: aiRefetch } = useQuery<aiListData, aiListVariables>(GET_AIS, {
        variables: {list: me?.allPrompts}
    });
    
    useEffect(()=> {
        if (aiData?.getAis) {
            setAiList(aiData?.getAis)
        }
    }, [aiData]) // eslint-disable-line


    
    // EVENT HANDLERS
    const loadAIs = ()=> {
        if (!aiList) {
            return
        }
        const newAiList = aiList.filter(ai=> ai.fav !== true)
        return newAiList?.map((ai: AI) => <AiButton refetch={aiRefetch} main={main} setMain={setMain} setShowSS={setShowSS} showSS={showSS} key={ai.id} ai={ai} />)
    }

    const loadFavAis = ()=> {
        if (!aiList) {
            return
        }
        const newAiList = aiList?.filter(ai => ai.fav === true)
        return newAiList?.map((ai: AI) => <AiButton refetch={aiRefetch} main={main} setMain={setMain} setShowSS={setShowSS} showSS={showSS} key={ai.id} ai={ai} />)
    }

    const openPanel = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=> {
        e.preventDefault()
        setShowMenu("add ai")
    }

    const theresfavs = ()=> {
        return aiList?.some(ai => ai.fav)
    }
    
    return(
        <div className={style[`main-sidebar`]}>
            <div className={`${style.logo} p`}>Pfy</div>
            <div className={style[`ais-wrapper`]}>
                {theresfavs() && <div className={style[`ai-logos`]}>{loadFavAis()}</div>}
                <div className="divisor"></div>
                <div className={style[`ai-logos`]}>{loadAIs()}</div>
            </div>
            <div className={`${style[`add-ai`]} p`} onClick={openPanel}>+</div>
        </div>
    )
}

export default MainSidebar;