import { Dispatch } from 'react'

import { AI, Mains, Visibility } from '../types'
import { theresFavs } from '@/utils/functions';

import AiButton from './AiButton';

import style from '../styles/mainSidebar.module.css'
 
interface MainSideBarProps {
    mains: Mains
    aiList: AI[] | undefined
    visibility: Visibility
    setVisibility: Dispatch<Visibility>
    setMains: Dispatch<Mains>
}

const MainSidebar = ({ aiList, mains, visibility, setMains, setVisibility}: MainSideBarProps)=> {

    // EVENT HANDLERS

    const loadAIs = (isFav = false) => {
        
        if (!aiList) return
        
        const newAiList = aiList.filter(ai => (isFav ? ai.fav === true : ai.fav !== true));
        
        return newAiList?.map((ai) => (
            <AiButton
                key={ai.id}
                ai={ai}
                mains={mains}
                setMains={setMains}
                setVisibility={setVisibility}
                visibility={visibility}
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