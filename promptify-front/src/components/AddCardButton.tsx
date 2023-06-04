import { Dispatch, useState } from "react"
import style from '../styles/mainContent.module.css'

interface AddCardButtonProps {
    setShowMenu: Dispatch<string>
}

const AddCardButton = ({ setShowMenu } : AddCardButtonProps)=> {

    const [open, setOpen] = useState<boolean>(false)

    return (
        <div className={style[`add-card-container`]}>
            {open && <div id={style[`add-stack-prompt`]}  className={`${style[`add-prompt`]} p`} onClick={()=>setShowMenu("add stack")}></div>}
            {open && <div id={style[`add-single-prompt`]} className={`${style[`add-prompt`]} p`} onClick={()=>setShowMenu("add prompt")}></div>}
            <div className={`${style[`add-prompt`]} p`} onClick={()=>setOpen(!open)}>+</div>
        </div>
    )
}

export default AddCardButton