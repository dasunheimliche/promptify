
import { Dispatch } from "react"
import { doNothing } from "@/utils/functions"
import style from '../styles/popups.module.css'

interface DeleteArgs {
    onAccept: ()=> void
    onCancel: Dispatch<boolean>
    isShown: boolean
    loading: boolean
}

const DeleteAlert = ({onAccept, onCancel, isShown, loading} : DeleteArgs)=> {
    return(
        <div className={isShown? style[`delete-background`] : style.hidden} >
            <div className={style[`delete-alert-container`]}>
                <div>Are you sure you want to delete this element?</div>
                <div className={style['delete-alert-buttons']}>
                    <button onClick={()=>onCancel(false)}>Cancel</button>
                    <button id={style.delete} onClick={loading? doNothing : onAccept}>Delete</button>
                </div>
            </div>                
        </div>
    )
}

export default DeleteAlert