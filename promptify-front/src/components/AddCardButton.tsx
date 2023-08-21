import { Dispatch, useState } from "react"
import { Visibility } from "@/types"
import style from '../styles/mainContent.module.css'

interface AddCardButtonProps {
    onOpenAddPromptMenu: ()=>void
    onOpenAddStackMenu: ()=>void
}

const AddCardButton = ({ onOpenAddPromptMenu, onOpenAddStackMenu } : AddCardButtonProps)=> {

    const [open, setOpen] = useState<boolean>(false)

    return (
        <div className={style[`add-card-container`]}>
            {open && <div id={style[`add-stack-prompt`]}  className={`${style[`add-prompt`]} p`} onClick={onOpenAddPromptMenu}></div>}
            {open && <div id={style[`add-single-prompt`]} className={`${style[`add-prompt`]} p`} onClick={onOpenAddStackMenu}></div>}
            <div className={`${style[`add-prompt`]} p`} onClick={()=>setOpen(!open)}>{open? "─": "+" }</div>
        </div>
    )
}

export default AddCardButton