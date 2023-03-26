import { Topic } from "@/types"
import { Dispatch } from "react"

interface DeleteArgs {
    setDeleteAlert: Dispatch<string>
    deleteHandler: ()=> void
}

const DeleteAlert = ({setDeleteAlert, deleteHandler} : DeleteArgs)=> {

    return(
        <div className="deleteAlert">
            <div className="deleteAlertContainer">
                <div className="deleteAlertMsg">Estas seguro de eliminar este elemento?</div>
                <div className="deleteAlertButtons">
                    <button className='deleteAlertCancel p' onClick={()=>setDeleteAlert("none")}>CANCEL</button>
                    <button className='deleteAlertAccept p' onClick={deleteHandler}>ACCEPT</button>
                </div>
            </div>                
        </div>
    )
}

export default DeleteAlert