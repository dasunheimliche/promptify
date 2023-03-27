import { Topic, AI } from "@/types"
import { Dispatch } from "react"
import DeleteAlert from "./DeleteAlert"

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

    deleteTopicfunc: (userId: string, topicId: string)=>void
    addTopicToFavs: any
    clickHandler: (sec: Topic)=>void

    setLista: Dispatch<Topic[]>
    setDeleteAlert: Dispatch<string>

}

const Topic = ({main, sec, lista, setLista, deleteTopicfunc, addTopicToFavs, setDeleteAlert, deleteAlert, clickHandler } : TopicProps)=> {


    const deleteTopicHandler = ()=> {
        console.log("CLICK DELETE TOPIC")
        deleteTopicfunc(main?.userId, sec.id)
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

    return (
        <div className="topic-container">
            {(deleteAlert === "topic") && <DeleteAlert setDeleteAlert={setDeleteAlert} deleteHandler={deleteTopicHandler} />}
            <div className={"ss-ai-topic p"} onClick={()=>clickHandler(sec)}>{sec.name}</div>
            {<div className="topic-opt">
                <div className="del-topic p"  onClick={()=>setDeleteAlert("topic")}></div>
                <div className={sec.fav? "fav-topic fav-topic-on p": "fav-topic p"} onClick={addToFav}></div>
            </div>}
        </div>
    )
}

export default Topic