import { Dispatch } from 'react'

import { AI, Mains, Visibility } from '../types'
import { theresFavs } from '@/utils/functions';

import { Logo, ProfileButton, AddAiButton, AiListComponent } from './MainSidebarModule';

import style from '../styles/mainSidebar.module.css'

import favIcon from '../icons/fav-on.png'
 
interface MainSideBarProps {
    mains: Mains
    aiList: AI[] | undefined
    visibility: Visibility
    setVisibility: Dispatch<Visibility>
    setMains: Dispatch<Mains>
}

const MainSidebar = ({ aiList, mains, visibility, setMains, setVisibility}: MainSideBarProps)=> {

    const isProfileButtonActive = mains.profile && visibility.showSS
    const isTopicsBarOpen = visibility.showSS
    const isAiListempty = !(aiList && aiList.length > 0)

    const handleOpenAddAiPopUp = ()=> {
        setVisibility({...visibility, showMenu: "add ai"})
    }

    const handleSelectProfileSection = ()=> {

        if (isProfileButtonActive) {
            setVisibility({...visibility, showSS: false})
        }

        if (isTopicsBarOpen) {
            setMains({...mains, profile: true})
        }

        if (!isTopicsBarOpen) {
            setVisibility({...visibility, showSS:true})
            setMains({...mains, profile: true})
        }
    }
    
    return(
        <div className={style.main}>
            <Logo />
            <ProfileButton onClick={handleSelectProfileSection} isActive={isProfileButtonActive}/>
            {!isAiListempty && <div className={style[`ai-section`]}>
                {theresFavs(aiList) && 
                    <div className={style.favourites}>
                        <img src={favIcon.src} alt="favs" className={style['fav-icon']}/>
                        <AiListComponent aiList={aiList} mains={mains} setMains={setMains} setVisibility={setVisibility} visibility={visibility} isFav={true}/>
                    </div>
                }
                <div className={style.divisor}>•</div>
                <AiListComponent aiList={aiList} mains={mains} setMains={setMains} setVisibility={setVisibility} visibility={visibility} isFav={false}/>
            </div>}
            <AddAiButton onClick={handleOpenAddAiPopUp} />
        </div>
    )
}

export default MainSidebar;