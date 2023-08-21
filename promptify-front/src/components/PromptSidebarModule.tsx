
import style from '../styles/promptSidebar.module.css'

interface PromptSidebarHeaderProps {
    isEdited: boolean
    onHideSidebar: ()=>void
    onRestart: ()=>void
    onClearPrompt: ()=>void
    onCopyPrompt: ()=>void
}

interface PromptSidebarSubtitle {
    subtitle: string | undefined
}

interface PromptSidebarContent {
    content: string | undefined
    onTyping: (e: React.ChangeEvent<HTMLTextAreaElement>)=>void
}

interface PromptSidebarFooterProps {
    onBack: ()=>void
    onForward: ()=>void
    currentPrompt: number
    stackLenght: number | undefined
}

export function PromptSidebarHeader ({isEdited, onHideSidebar, onRestart, onClearPrompt, onCopyPrompt} : PromptSidebarHeaderProps) {

    return(
        <div className={style.header}>
            <span className={`${style[`back-button`]} p`} onClick={onHideSidebar}></span>
            <div className={style.buttons}>
                <button className={isEdited? `p ${style.update}` : `p`} onClick={onRestart}>{isEdited? "UPDATE" : "RESTART"}</button> 
                <button className='p' onClick={onClearPrompt}>CLEAR</button>   
                <button className='p' onClick={onCopyPrompt}>COPY</button>
            </div>
        </div>
    )
}

export function PromptSidebarTitle ({title} : {title: string | undefined}) {
    return(
        <div className={style[`content-title`]}>{title}</div>
    )
}

export function PromptSidebarSubtitle ({subtitle} : PromptSidebarSubtitle) {
    return(
        <div className={style[`content-subtitle-container`]}>
            <div>{subtitle}</div>
        </div>
    )
}

export function PromptSidebarContent ({content, onTyping} : PromptSidebarContent) {
    return <textarea className={style[`content-textarea`]} placeholder='prompt' value={content} onChange={onTyping} spellCheck="false"></textarea>

}

export function PromptSidebarFooter ({onBack, onForward, currentPrompt, stackLenght} : PromptSidebarFooterProps) {
    return(
        <div className={style[`content-playback`]}>
            <div className={style.playback} onClick={onBack}>{"< "}</div>
            <div>{`${currentPrompt}/${stackLenght}`}</div>
            <div className={style.playback} onClick={onForward}>{" >"}</div>
        </div>
    )
}