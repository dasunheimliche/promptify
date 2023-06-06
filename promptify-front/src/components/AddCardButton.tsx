import { Dispatch, useState } from "react"
import { Visibility } from "@/types"
import style from '../styles/mainContent.module.css'

interface AddCardButtonProps {
    visibility: Visibility
    setVisibility: Dispatch<Visibility>
}

const AddCardButton = ({ visibility, setVisibility } : AddCardButtonProps)=> {

    const [open, setOpen] = useState<boolean>(false)

    return (
        <div className={style[`add-card-container`]}>
            {open && <div id={style[`add-stack-prompt`]}  className={`${style[`add-prompt`]} p`} onClick={()=>setVisibility({...visibility, showMenu: "add stack"})}></div>}
            {open && <div id={style[`add-single-prompt`]} className={`${style[`add-prompt`]} p`} onClick={()=>setVisibility({...visibility, showMenu: "add prompt"})}></div>}
            <div className={`${style[`add-prompt`]} p`} onClick={()=>setOpen(!open)}>+</div>
        </div>
    )
}

export default AddCardButton