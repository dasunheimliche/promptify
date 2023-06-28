
import { Dispatch, useState, useRef, useEffect } from "react"

import { useMutation } from '@apollo/client'
import { EDIT_TOPIC } from "@/queries"

import { Topic, AI, Mains } from "@/types"

import DeleteAlert from "./DeleteAlert"

import style from '../styles/secSidebar.module.css'


interface TopicProps {
    sec: Topic
    topicList: Topic[] | undefined
    deleteAlert: string
    mains: Mains

    deleteTopicfunc: (userId: string, topicId: string)=>void
    DTloading: boolean
    ATTFloading: boolean
    addTopicToFavs: any
    clickHandler: (sec: Topic)=>void

    setTopicList: Dispatch<Topic[]>
    setDeleteAlert: Dispatch<string>
    setMains: Dispatch<Mains>

}

const Topic = ({ sec, topicList, mains, setMains, setTopicList, deleteTopicfunc, addTopicToFavs, setDeleteAlert, deleteAlert, clickHandler, DTloading, ATTFloading } : TopicProps)=> {

    const [edit,    setEdit   ] = useState<boolean>(false)
    const [newName, setNewName] = useState<string>(sec.name)

    const inputRef = useRef<HTMLInputElement>(null)
    const [ editTopic, { loading: ETloading} ] = useMutation(EDIT_TOPIC)

    // EVENT HANDLERS
    const deleteTopicHandler = async()=> {
        if (!mains.main) {
            return
        }
        await deleteTopicfunc(mains.main?.userId, sec.id)
        setDeleteAlert("none")
    }

    useEffect(()=> {
        inputRef.current?.focus()
    },[edit])

    const editTopicHandler = async () => {
        try {
            if (!topicList || !mains.main || !newName) {
                return;
            }
            const newTopic = await editTopic({ variables: { topicId: sec.id, newName: newName } });
            const aiIndex = topicList?.findIndex((t) => t.id === sec.id);
            const newMainTopic = { ...sec, name: newTopic.data.editTopic.name };
        
            const newList = [...topicList];
            newList[aiIndex] = newTopic.data.editTopic.name;
            setTopicList(newList);
            setEdit(!edit);
            if (sec.id === mains.topic?.id) {
                setMains({ ...mains, topic: newMainTopic });
            }
        } catch (error) {
            console.error('An error occurred while editing the topic:', error);
        }
    };

    const addToFav = async () => {
        try {
            if (!topicList) {
                return;
            }
            const newTopic = await addTopicToFavs({ variables: { topicId: sec.id } });
            const topicIndex = topicList.findIndex((t: Topic) => t.id === sec?.id);
        
            const newTopicList = [...topicList];
            newTopicList[topicIndex] = newTopic.data.addTopicToFavs;
            setTopicList(newTopicList);
        } catch (error) {
            console.error('An error occurred while adding to favorites:', error);
        }
    };

    const doNothing = (e:any)=> {
        e.preventDefault()
    }

    return (
        <div className={style[`topic-container`]}>
            {(deleteAlert === "topic") && <DeleteAlert setDeleteAlert={setDeleteAlert} deleteHandler={deleteTopicHandler} loading={DTloading}/>}
            {!edit && <div className={ `${style[`topic-name`]} p`} onClick={()=>clickHandler(sec)}>{sec.name}</div>}
            {edit && <input ref={inputRef} value={newName} type={"text"} placeholder="Edit name" className={ `${style[`topic-name`]} p unset`} onChange={(e)=>setNewName(e.target.value)}/>}

            {<div className={style[`topic-opt`]}>
                {!edit && <div className={`${style[`del-topic`]} p`}  onClick={()=>setDeleteAlert("topic")}></div>}
                {!edit && <div className={`${style[`edit-topic`]} p`} onClick={()=>setEdit(!edit)}></div>}  
                {!edit && <div className={sec.fav? `${style[`fav-topic`]} ${style[`fav-topic-on`]} p`: `${style[`fav-topic`]} p`} onClick={ATTFloading? doNothing : addToFav}></div>}
                {edit  && <div className={`${style.yes} p`} onClick={ETloading? doNothing : editTopicHandler}>✓</div>}
                {edit  && <div className={`${style.not} p`} onClick={()=>setEdit(false)}>✕</div>}
            </div>}
        </div>
    )
}

export default Topic