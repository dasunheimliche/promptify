
import { AI, Mains, Visibility } from '@/types'
import { Dispatch } from 'react'

import style from '../styles/mainSidebar.module.css'

interface ProfileButtonProps {
    isActive: boolean
    onClick: ()=>void
}

interface AddAiButtonProps {
    onClick: ()=>void
}

interface AiButtonProps {
    caption: string
    isActive: boolean | undefined | ""
    onClick: ()=>void
}

interface AiListComponentProps {
    aiList: AI[] | undefined
    mains: Mains
    setMains: Dispatch<Mains>
    visibility: Visibility
    setVisibility: Dispatch<Visibility>
    isFav: boolean
}

function AiButton ({caption, isActive, onClick } : AiButtonProps) {

    return(
        <div  className={isActive? `${style[`ai-logo`]} ${style['selected-ai']} p` : `${style[`ai-logo`]} p` } onClick={onClick}>{caption}</div>
    )
}

export function Logo () {
    return <div className={`${style.promptify} p`}>Pfy</div>
}

export function ProfileButton ({onClick, isActive} : ProfileButtonProps ) {
    return <div className={isActive? `${style[`add-ai`]} ${style['selected-me']} p` :`${style[`add-ai`]} p`} onClick={onClick}>ME</div>
}

export function AddAiButton ({onClick} : AddAiButtonProps) {
    return <div className={`${style[`add-ai`]} p`} onClick={onClick}>+</div>
}

export function AiListComponent ({ aiList, mains, setMains, setVisibility, visibility, isFav } : AiListComponentProps) {
    
    const filteredAiList = aiList?.filter((ai : AI) => (isFav ? ai.fav === true : ai.fav !== true));

    return (
        <div className={style['ai-list']}>
            {filteredAiList?.map((ai: AI) => {

                const handleClick = (ai: AI)=> {

                    setMains({...mains, main: {id: ai.id}, profile: false})
            
                    if (visibility.showSS && mains.profile) {
                        return
                    }
            
                    if (visibility.showSS && (ai.id !== mains.main?.id)) {
                        return
                    }
            
                    if (visibility.showSS && (ai.id === mains.main?.id)) {
                        setVisibility({...visibility, showSS: false})
                        return
                    }
            
                    if (!visibility.showSS) {
                        setVisibility({...visibility, showSS: true})
                    }
                }

                return(
                    <AiButton
                        key={ai.id}
                        caption={ai.abb}
                        isActive={mains.main?.id && ai.id === mains.main.id}
                        onClick={()=>handleClick(ai)}
                    />
                )
            }
            )}
        </div>
    );
};