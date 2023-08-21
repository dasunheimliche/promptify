
import style from '../styles/popups.module.css'

interface EditPromptHeaderProps {
    mode: "prompt" | "stack"
    onToggleMode: ()=>void
    onClose: ()=>void
}

interface StackTitleProps {
    mode: "prompt" | "stack"
    title: string
    onTyping: (e: React.ChangeEvent<HTMLInputElement>)=>void
}

interface StackOptionsProps {
    isSingle: boolean
    onNext: (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>void
    onPrevious: (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>void
    onDelete: (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>void
    onAddToStack: (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>void
    current: number
    stackLenght: number
}

interface PromptTitleProps {
    title: string
    onTyping: (e:React.ChangeEvent<HTMLInputElement>)=>void
}

interface PromptContentProps {
    content: string
    onTyping: (e: React.ChangeEvent<HTMLTextAreaElement>)=>void
}

interface EditPromptFooter {
    isMutating: boolean
    onSaveChanges: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>void
}

export function EditPromptHeader ({mode, onToggleMode, onClose} : EditPromptHeaderProps) {

    return(
        <div className={style.header}>
            <div className={style[`header-first`]}>
                <div className={style[`header-title`]}>{mode === "prompt"? "Edit Prompt" : "Edit Stack"}</div>
                <button className="p" onClick={onToggleMode}>{mode === "prompt"? "To stack" : "To prompt"}</button>
            </div>

            <div className={`${style[`header-close`]} p`} onClick={onClose}>✕</div>
        </div>
    )
}

export function StackTitle ({mode, title, onTyping} : StackTitleProps) {
    return(
        <label className={style.title}>{mode === "prompt"? "TITLE:" : "STACK TITLE:"}
            <input value={title} type="text" placeholder="title" onChange={onTyping} minLength={1} required/>
        </label>
    )
}

export function PromptTitle ({title, onTyping} : PromptTitleProps) {

    return(
        <label className={style.title}>{"PROMPT TITLE:"}
            <input value={title} placeholder={"Edit prompt title"} onChange={onTyping} minLength={1} required/>
        </label>
    )
}

export function StackOptions ({isSingle, onNext, onPrevious, onDelete, onAddToStack, current, stackLenght} : StackOptionsProps) {

    return(
        <div className={style[`stack-header`]}>

            <div className={style.title}>
                <div className={style.playback}>
                    <button className={style.goBack} title='previous' onClick={onPrevious} />
                    <div>{`${current} of ${stackLenght}`}</div>
                    <button className={style.goForward} title='next' onClick={onNext} />
                </div>
            </div>

            <div className={style.options}>
                {isSingle && <button className={style.delete} title='delete' onClick={onDelete}></button>}
                <button className={style.addPrompt} title='add' onClick={onAddToStack} >Add + </button>
            </div>
        </div>
    )
}

export function PromptContent ({content, onTyping} : PromptContentProps) {

    return (
        <label htmlFor="" className={style.title}>
            {"PROMPT CONTENT:"}
            <textarea value={content} placeholder="Write your prompt" onChange={onTyping} minLength={1} required/>
        </label>
    )
}

export function EditPromptFooter ({onSaveChanges, isMutating} : EditPromptFooter) {

    return(
        <div className={style.buttons}>
            <button onClick={onSaveChanges} disabled={isMutating}>SAVE</button>
        </div>
    )
}