
import { Dispatch, useState, useRef, useEffect } from "react"

import { useMutation } from '@apollo/client'
import { EDIT_TOPIC, GET_TOPICS, ADD_TOPIC_FAV, DELETE_TOPIC } from "@/queries"
import { doNothing } from "@/utils/functions"

import { AI, Topic, Mains } from "@/types"

import DeleteAlert from "./DeleteAlert"

import style from '../styles/secSidebar.module.css'


interface TopicProps {
    sec: Topic
    topicList: Topic[] | undefined
    deleteAlert: string
    mains: Mains
    currentAI: AI | undefined
    toDelete: Topic | undefined
    setToDelete: Dispatch<Topic | undefined> 
    clickHandler: (sec: Topic)=>void
    setDeleteAlert: Dispatch<string>
    setMains: Dispatch<Mains>
}


const Topic = ({ sec, toDelete, setToDelete, currentAI, topicList, mains, setMains, setDeleteAlert, deleteAlert, clickHandler } : TopicProps)=> {

    const [edit,    setEdit   ] = useState<boolean>(false)
    const [newName, setNewName] = useState<string>(sec.name)

    const inputRef = useRef<HTMLInputElement>(null)

    const [ deleteTopic,    {loading: DTloading}   ] = useMutation(DELETE_TOPIC, {
        update: (cache, response) => {
            cache.updateQuery({query: GET_TOPICS, variables: { mainId: currentAI?.id }}, ({ getTopics })=> {
                return {
                    getTopics: getTopics.filter((topic: Topic) =>  response.data?.deleteTopic !== topic.id)
                }
            })
        }
    })

    const [ addTopicToFavs, {loading: ATTFloading} ] = useMutation(ADD_TOPIC_FAV)

    const [ editTopic, { loading: ETloading} ] = useMutation(EDIT_TOPIC)

    // EVENT HANDLERS
    const deleteTopicHandler = async()=> {
        
        if (!toDelete) return
        
        await deleteTopicfunc(toDelete?.aiId, toDelete?.id)

        setDeleteAlert("none")
        setToDelete(undefined)
    }

    const deleteTopicfunc = async (aiId: string, topicId:string) => {
        
        if (!topicList) return;

        try {
            await deleteTopic({ variables: { aiId, topicId } });
        
            const updatedTopicList = topicList.filter((arrayTopic: Topic) => arrayTopic.id !== topicId);
        
            if (mains.topic?.id === topicId) {
                setMains({ ...mains, topic: updatedTopicList[0] });
            }
        } catch (error) {
            console.error('An error occurred while deleting the topic:', error);
        }
    };

    

    const editTopicHandler = async () => {

        if (!newName) return

        try {

            await editTopic({ variables: { topicId: sec.id, newName: newName } });
            setEdit(!edit);

        } catch (error) {
            console.error('An error occurred while editing the topic:', error);
        }
    };

    const addToFav = async () => {
        
        try {

            await addTopicToFavs({ variables: { topicId: sec.id } })

        } catch (error) {
            console.error('An error occurred while adding to favorites:', error);
        }
    };

    useEffect(()=> {
        inputRef.current?.focus()
    },[edit])

    return (
        <div className={style[`topic-container`]} >
            {(deleteAlert === "topic") && <DeleteAlert setDeleteAlert={setDeleteAlert} deleteHandler={deleteTopicHandler} loading={DTloading} />}
            {!edit && <div className={ `${style[`topic-name`]} p`} onClick={()=>clickHandler(sec)}>{sec.name}</div>}
            {edit && <input ref={inputRef} value={newName} type={"text"} placeholder="Edit name" className={ `${style[`topic-name`]} p unset`} onChange={(e)=>setNewName(e.target.value)}/>}

            {<div className={style[`topic-opt`]}>
                {!edit && <div className={`${style[`del-topic`]} p`}  onClick={()=>{setToDelete(sec);setDeleteAlert("topic")}} ></div>}
                {!edit && <div className={`${style[`edit-topic`]} p`} onClick={()=>setEdit(!edit)}></div>}  
                {!edit && <div className={sec.fav? `${style[`fav-topic`]} ${style[`fav-topic-on`]} p`: `${style[`fav-topic`]} p`} onClick={ATTFloading? doNothing : addToFav}></div>}
                {edit  && <div className={`${style.yes} p`} onClick={ETloading? doNothing : editTopicHandler}>✓</div>}
                {edit  && <div className={`${style.not} p`} onClick={()=>setEdit(false)}>✕</div>}
            </div>}
        </div>
    )
}

export default Topic