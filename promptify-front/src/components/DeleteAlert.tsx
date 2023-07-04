
import { Dispatch } from "react"
import { doNothing } from "@/utils/functions"
import style from '../styles/popups.module.css'


interface DeleteArgs {
    setDeleteAlert: Dispatch<string>
    deleteHandler: ()=> void
    loading: boolean
}

const DeleteAlert = ({setDeleteAlert, deleteHandler, loading} : DeleteArgs)=> {
    return(
        <div className={style[`delete-background`]}>
            <div className={style[`delete-alert-container`]}>
                <div>Are you sure you want to delete this element?</div>
                <div className={style[`delete-alert-buttons`]}>
                    <button onClick={()=>setDeleteAlert("none")}>CANCEL</button>
                    <button id={style.delete} onClick={loading? doNothing : deleteHandler}>DELETE</button>
                </div>
            </div>                
        </div>
    )
}

export default DeleteAlert