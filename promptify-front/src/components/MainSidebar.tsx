import { useEffect, Dispatch } from 'react'

import { AI, User, Topic, Mains, Visibility } from '../types'
import { theresFavs } from '@/utils/functions';

import { GET_AIS } from '@/queries'
import { useQuery } from '@apollo/client';

import AiButton from './AiButton';

import style from '../styles/mainSidebar.module.css'
 
interface MainSideBarProps {
    mains: Mains
    me: User | undefined
    aiList: AI[] | undefined
    topicList: Topic[] | undefined
    visibility: Visibility
    setVisibility: Dispatch<Visibility>
    setMains: Dispatch<Mains>
    setAiList: Dispatch<AI[]>
    setTopicList: Dispatch<Topic[] | undefined>
}

interface aiListData {
    getAis: AI[]
}

interface aiListVariables {
    meId: string | undefined
}



const MainSidebar = ({ aiList, mains, me, topicList, visibility, setMains, setVisibility, setAiList, setTopicList}: MainSideBarProps)=> {

    //** GRAPHQL QUERYS
    const { data: aiData, refetch: aiRefetch } = useQuery<aiListData, aiListVariables>(GET_AIS, {
        variables: {meId: me?.id},
        skip: !me?.id
    });

    //** USE EFFECTS
    
    useEffect(()=> {
        if (aiData?.getAis) {
            setAiList(aiData?.getAis)
        }
    }, [aiData]) // eslint-disable-line

    useEffect(()=> {
        aiRefetch()
    }, [me]) // eslint-disable-line


    
    // EVENT HANDLERS

    const loadAIs = (isFav = false) => {
        if (!aiList) {
          return;
        }
        
        const newAiList = aiList.filter(ai => (isFav ? ai.fav === true : ai.fav !== true));
        
        return newAiList?.map((ai) => (
            <AiButton
                key={ai.id}
                ai={ai}
                mains={mains}
                topicList={topicList}
                setMains={setMains}
                setVisibility={setVisibility}
                visibility={visibility}
                setTopicList={setTopicList}
            />
        ));
      };

    const openPanel = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=> {
        e.preventDefault()
        setVisibility({...visibility, showMenu: "add ai"})
    }

    const toProfile = ()=> {

        if (mains.profile && visibility.showSS) {
            setMains({...mains, profile: false})
            setVisibility({...visibility, showSS: false})
        }

        if (visibility.showSS) {
            setMains({...mains, profile: true})
        }

        if (!visibility.showSS) {
            setVisibility({...visibility, showSS:true})
            setMains({...mains, profile: true})
        }
    }
    
    return(
        <div className={style[`main-sidebar`]}>
            <div className={`${style.logo} p`}>Pfy</div>
            <div className={(mains.profile && visibility.showSS)? `${style[`add-ai`]} ${style['selected-me']} p` :`${style[`add-ai`]} p`} onClick={toProfile}>ME</div>
            {(aiList && aiList.length > 0) && <div className={style[`ais-wrapper`]}>
                {theresFavs(aiList) && 
                    <div className={style['favs-container']}>
                        <div className={style['fav-ais']}></div>
                        <div className={style[`ai-logos`]}>{loadAIs(true)}</div>
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