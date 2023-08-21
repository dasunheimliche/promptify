
import { Dispatch, useState, useRef, useEffect } from "react"

import { useMutation } from '@apollo/client'
import { EDIT_TOPIC, GET_TOPICS, ADD_TOPIC_FAV, DELETE_TOPIC } from "@/queries"

import { Topic, Mains } from "@/types"

import DeleteAlert from "./DeleteAlert"
import { EditableTopicTitle, TopicOptions } from "./SecondSidebarModule"

import style from '../styles/secondSidebar.module.css'


interface TopicProps {
    sec: Topic
    topicList: Topic[] | undefined
    mains: Mains
    onClick: ()=>void
    setMains: Dispatch<Mains>
}


const Topic = ({ sec, topicList, mains, setMains, onClick } : TopicProps)=> {

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
            <DeleteAlert onAccept={deleteTopicHandler} onCancel={setDel} loading={DTloading} isShown={del}/>
            <EditableTopicTitle 
                isEditEnabled={edit}
                title={sec.name}
                newTitle={newName}
                onClick={onClick}
                onTyping={(e)=>setNewName(e.target.value)}
            />
            <TopicOptions 
                isEditEnabled={edit}
                isFav={sec.fav}
                isMutating={DTloading || ETloading || ATTFloading}
                onOpenDeleteMenu={()=>setDel(true)}
                onEnableEditMode={()=>setEdit(!edit)}
                onConfirmEdit={editTopicHandler}
                onCancelEdit={()=>setEdit(false)}
                onToggleFav={addToFav}
            />
        </div>
    )
}

export default Topic