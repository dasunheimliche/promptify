
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
    mains: Mains
    clickHandler: (sec: Topic)=>void
    setMains: Dispatch<Mains>
}


const Topic = ({ sec, topicList, mains, setMains, clickHandler } : TopicProps)=> {

    const [edit,    setEdit   ] = useState<boolean>(false)
    const [newName, setNewName] = useState<string>(sec.name)
    const [del,     setDel    ] = useState<boolean>(false)

    const inputRef = useRef<HTMLInputElement>(null)

    const [ deleteTopic,    {loading: DTloading}   ] = useMutation(DELETE_TOPIC, {
        update: (cache, response) => {
            cache.updateQuery({query: GET_TOPICS, variables: { mainId: mains.main?.id }}, ({ getTopics })=> {
                return {
                    getTopics: getTopics.filter((topic: Topic) =>  response.data?.deleteTopic !== topic.id)
                }
            })
        }
    })

    const [ addTopicToFavs, {loading: ATTFloading} ] = useMutation(ADD_TOPIC_FAV)

    const [ editTopic, { loading: ETloading} ] = useMutation(EDIT_TOPIC)

    // EVENT HANDLERS

    const deleteTopicfunc = async (aiId: string, topicId:string) => {
        
        if (!topicList) return;

        try {
            await deleteTopic({ variables: { aiId, topicId } });
        
            const updatedTopicList = topicList.filter((arrayTopic: Topic) => arrayTopic.id !== topicId);
        
            if (mains.topic?.id === topicId) { 
                setMains({ ...mains, topic: {id:updatedTopicList[0].id, aiId: updatedTopicList[0].aiId} });
            }
        } catch (error) {
            console.error('An error occurred while deleting the topic:', error);
        }
    };

    const deleteTopicHandler = async()=> {
        
        await deleteTopicfunc(sec?.aiId, sec?.id)

        setDel(false)
    }
    

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
            {del && <DeleteAlert onAccept={deleteTopicHandler} onCancel={setDel} loading={DTloading} />}

            {!edit && <div className={ `${style[`topic-name`]} p`} onClick={()=>clickHandler(sec)}>{sec.name}</div>}
            {edit && <input ref={inputRef} value={newName} type={"text"} placeholder="Edit name" className={ `${style[`topic-name`]} p unset`} onChange={(e)=>setNewName(e.target.value)}/>}

            {<div className={style[`topic-opt`]}>
                {!edit && <div className={`${style[`del-topic`]} p`}  onClick={()=>setDel(true)} ></div>}
                {!edit && <div className={`${style[`edit-topic`]} p`} onClick={()=>setEdit(!edit)}></div>}  
                {!edit && <div className={sec.fav? `${style[`fav-topic`]} ${style[`fav-topic-on`]} p`: `${style[`fav-topic`]} p`} onClick={ATTFloading? doNothing : addToFav}></div>}

                {edit  && <div className={`${style.yes} p`} onClick={ETloading? doNothing : editTopicHandler}>✓</div>}
                {edit  && <div className={`${style.not} p`} onClick={()=>setEdit(false)}>✕</div>}
            </div>}
        </div>
    )
}

export default Topic