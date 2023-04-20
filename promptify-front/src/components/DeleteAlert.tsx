
import { Dispatch } from "react"
import style from '../styles/popups.module.css'


interface DeleteArgs {
    setDeleteAlert: Dispatch<string>
    deleteHandler: ()=> void
    loading: boolean
}

const DeleteAlert = ({setDeleteAlert, deleteHandler, loading} : DeleteArgs)=> {

    const doNothing = (e: any)=> {
        e.preventDefault()
    }

    return(
        <div className={style[`delete-background`]}>
            <div className={style[`delete-alert-container`]}>
                <div>Estas seguro de eliminar este elemento?</div>
                <div className={style[`delete-alert-buttons`]}>
                    <button onClick={()=>setDeleteAlert("none")}>CANCEL</button>
                    <button onClick={loading? doNothing : deleteHandler}>ACCEPT</button>
                </div>
            </div>                
        </div>
    )
}

export default DeleteAlert