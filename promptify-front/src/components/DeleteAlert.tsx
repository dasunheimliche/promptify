
import { Dispatch } from "react"
import { doNothing } from "@/utils/functions"
import style from '../styles/popups.module.css'

interface DeleteArgs {
    onAccept: ()=> void
    onCancel: Dispatch<boolean>
    loading: boolean
}

const DeleteAlert = ({onAccept, onCancel, loading} : DeleteArgs)=> {
    return(
        <div className={style[`delete-background`]}>
            <div className={style[`delete-alert-container`]}>
                <div>Are you sure you want to delete this element?</div>
                <div className={style[`delete-alert-buttons`]}>
                    <button onClick={()=>onCancel(false)}>CANCEL</button>
                    <button id={style.delete} onClick={loading? doNothing : onAccept}>DELETE</button>
                </div>
            </div>                
        </div>
    )
}

export default DeleteAlert