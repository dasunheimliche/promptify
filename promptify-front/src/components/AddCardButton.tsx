import { Dispatch, useState } from "react"


interface AddCardButtonProps {
    setShowMenu: Dispatch<string>
}

const AddCardButton = ({ setShowMenu } : AddCardButtonProps)=> {

    const [open, setOpen] = useState<boolean>(false)

    return (
        <div className="add-prompt-container">
            {open && <div id="add-stack-prompt" className='add-prompt p' onClick={()=>setShowMenu("add stack")}></div>}
            {open && <div id="add-single-prompt" className='add-prompt p' onClick={()=>setShowMenu("add prompt")}></div>}
            <div className='add-prompt p' onClick={()=>setOpen(!open)}>+</div>
        </div>
    )
}

export default AddCardButton