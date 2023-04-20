import { Topic, AI } from "@/types"
import { Dispatch, useState, useRef, useEffect } from "react"
import DeleteAlert from "./DeleteAlert"
import style from '../styles/secSidebar.module.css'
import { useMutation } from '@apollo/client'
import { EDIT_TOPIC } from "@/queries"

interface addTopicVariables {
    aiId: string
    topic: {
        name: string
    }
}

interface TopicProps {
    main: AI
    sec: Topic
    lista: Topic[] | undefined
    deleteAlert: string
    topic: Topic | undefined

    deleteTopicfunc: (userId: string, topicId: string)=>void
    DTloading: boolean
    ATTFloading: boolean
    addTopicToFavs: any
    clickHandler: (sec: Topic)=>void

    setLista: Dispatch<Topic[]>
    setDeleteAlert: Dispatch<string>
    setTopic: Dispatch<Topic>

}

const Topic = ({main, sec, lista, topic, setTopic, setLista, deleteTopicfunc, addTopicToFavs, setDeleteAlert, deleteAlert, clickHandler, DTloading, ATTFloading } : TopicProps)=> {

    const [edit, setEdit] = useState<boolean>(false)
    const [newName, setNewName] = useState<string>(sec.name)

    const inputRef = useRef<HTMLInputElement>(null)
    const [ editTopic, { loading: ETloading} ] = useMutation(EDIT_TOPIC)

    // EVENT HANDLERS
    const deleteTopicHandler = async()=> {
        await deleteTopicfunc(main?.userId, sec.id)
        setDeleteAlert("none")
    }

    useEffect(()=> {
        inputRef.current?.focus()
    },[edit])

    const editTopicHandler = async() => {
        if (!lista || !main || !newName) {
            return
        }
        const newTopic = await editTopic({variables:{topicId:sec.id, newName:newName}})
        const aiIndex = lista?.findIndex(t=> t.id === sec.id)
        const newMainTopic = {...sec, name: newTopic.data.editTopic.name}

        const newList = [...lista]
        newList[aiIndex] = newTopic.data.editTopic.name
        setLista(newList)
        setEdit(!edit)
        if (sec.id === topic?.id) {
            setTopic(newMainTopic)
        }
    }

    const addToFav = async()=> {
        if (!lista) {
            return
        }
        const newTopic = await addTopicToFavs({variables:{topicId: sec.id}})
        const topicIndex = lista.findIndex((t: Topic) => t.id === sec?.id)

        const newTopicList = [...lista];
        newTopicList[topicIndex] = newTopic.data.addTopicToFavs
        setLista(newTopicList)
    }

    const doNothing = (e:any)=> {
        e.preventDefault()
    }

    return (
        <div className={style[`topic-container`]}>
            {(deleteAlert === "topic") && <DeleteAlert setDeleteAlert={setDeleteAlert} deleteHandler={deleteTopicHandler} loading={DTloading}/>}
            {!edit && <div className={ `${style[`topic-name`]} p`} onClick={()=>clickHandler(sec)}>{sec.name}</div>}
            {edit && <input ref={inputRef} value={newName} type={"text"} placeholder="Edit name" className={ `${style[`topic-name`]} p unset`} onChange={(e)=>setNewName(e.target.value)}/>}

            {<div className={style[`topic-opt`]}>
                {!edit && <div className={`${style[`edit-topic`]} p`} onClick={()=>setEdit(!edit)}></div>}
                {!edit && <div className={`${style[`del-topic`]} p`}  onClick={()=>setDeleteAlert("topic")}></div>}
                {!edit && <div className={sec.fav? `${style[`fav-topic`]} ${style[`fav-topic-on`]} p`: `${style[`fav-topic`]} p`} onClick={ATTFloading? doNothing : addToFav}></div>}
                {edit && <div onClick={ETloading? doNothing : editTopicHandler}>YES</div>}
                {edit && <div onClick={()=>setEdit(false)}>NO</div>}
            </div>}
        </div>
    )
}

export default Topic