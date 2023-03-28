
import { Dispatch } from "react"
import style from '../styles/popups.module.css'


interface DeleteArgs {
    setDeleteAlert: Dispatch<string>
    deleteHandler: ()=> void
}

const DeleteAlert = ({setDeleteAlert, deleteHandler} : DeleteArgs)=> {

    return(
        <div className={style[`delete-background`]}>
            <div className={style[`delete-alert-container`]}>
                <div>Estas seguro de eliminar este elemento?</div>
                <div className={style[`delete-alert-buttons`]}>
                    <button onClick={()=>setDeleteAlert("none")}>CANCEL</button>
                    <button onClick={deleteHandler}>ACCEPT</button>
                </div>
            </div>                
        </div>
    )
}

export default DeleteAlert