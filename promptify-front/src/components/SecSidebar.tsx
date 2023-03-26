import { useState, Dispatch, useEffect } from 'react'
import { AI, Topic } from '../types'
import { GET_TOPICS, ADD_TOPIC, DELETE_TOPIC, DELETE_AI, ADD_AI_FAV, ADD_TOPIC_FAV } from '@/queries'
import { useQuery, useMutation } from '@apollo/client';
import DeleteAlert from './DeleteAlert';

interface SecSideBarProps {
    main: AI | undefined
    topic: Topic | undefined
    showSS: boolean
    aiList: AI[] | undefined
    setAiList: Dispatch<AI[]>
    setTopic: Dispatch<Topic>
    setMain: Dispatch<AI>
} 
interface topicListData {
    getTopics: Topic[]
}
interface topicListVariables {
    list: string[] | undefined
}

interface addAiData {
    createTopic: Topic
}
interface addTopicVariables {
    aiId: string
    topic: {
        name: string
    }
}

const SecSidebar = ({main, topic, aiList, showSS, setTopic, setAiList, setMain}: SecSideBarProps)=> {
    const [addTopic, setAddTopic] = useState<string>("")
    const [show, setShow] = useState<boolean>(false)

    const [deleteAlert, setDeleteAlert] = useState<string>("none")

    // USE QUERY

    const { loading, error, data, refetch } = useQuery<topicListData, topicListVariables>(GET_TOPICS, {
        variables: { list: main?.topics }
    });

    const [lista, setLista] = useState<Topic[] | undefined>(undefined)

    useEffect(()=> {
        if (data) {
            setLista(data.getTopics)
        }
      }, [data])

    // MUTATIONS

    const [ createTopic ] = useMutation<addAiData, addTopicVariables>(ADD_TOPIC)
    const [ deleteTopic ] = useMutation(DELETE_TOPIC)
    const [ deleteAi ] = useMutation(DELETE_AI)
    const [ addAiToFavs ] = useMutation(ADD_AI_FAV);
    const [ addTopicToFavs ] = useMutation(ADD_TOPIC_FAV)

    // EVENT HANDLERS
    const deleteAifunc = async (userId: string | undefined, aiId: string | undefined)=> {

        if (!userId || !aiId) {
            return
        }

        await deleteAi({variables: {userId, aiId}})

        if (!aiList) return

        const newAiList = aiList.filter(arrayAi => arrayAi.id != aiId)

        setAiList(newAiList)

        if (newAiList.length === 0) {
            return
        } else {
            setMain(newAiList[0])
            setDeleteAlert("none")
        }

    }

    const deleteAiHandler = ()=> {
        deleteAifunc(main?.userId, main?.id)
    }

    const deleteTopicfunc = async (aiId:string, topicId:string)=> {

        if (!topic) {
            return
        }

        await deleteTopic({variables: {aiId, topicId}})

        if (!lista) {
            return
        }

        const newTopic = lista.filter(arrayTopic => arrayTopic.id !== topicId)
        setLista(newTopic)
        setTopic(newTopic[0])
    }

    const loadSections = ()=>{
        if (!main) {
            return
        }

        const clickHandler = (sec: Topic)=> {
            setTopic(sec)
            refetch()
        }
        console.log("LOADING NO FAV SECTIONS WITH", lista)
        const newTopicList = lista?.filter(t=> t?.fav === false )
        console.log("NO FAV SECTIONS", newTopicList)

        return newTopicList?.map((sec:Topic, i:number) => {

            const deleteTopicHandler = ()=> {
                console.log("CLICK DELETE TOPIC")
                deleteTopicfunc(main?.userId, sec.id)
            }

            const addToFav = async()=> {
                if (!lista) {
                    return
                }
                const newTopic = await addTopicToFavs({variables:{topicId: sec.id}})
                const topicIndex = lista.findIndex(t => t.id === topic?.id)

                const newTopicList = [...lista];
                newTopicList[topicIndex] = newTopic.data.addTopicToFavs
                setLista(newTopicList)
            }

            return (
                <div key={i} className="topic-container">
                    {(deleteAlert === "topic") && <DeleteAlert setDeleteAlert={setDeleteAlert} deleteHandler={deleteTopicHandler} />}
                    <div className={"ss-ai-topic p"} onClick={()=>clickHandler(sec)}>{sec.name}</div>
                    {topic?.id === sec.id && <div className="topic-opt">
                        <div className="del-topic p" onClick={addToFav}>F</div>
                        <div className="del-topic p" onClick={()=>setDeleteAlert("topic")}>D</div>
                    </div>}
                </div>
            )
        })
    }

    const loadFavSections = ()=>{
        console.log("LOADING FAV SECTIONS")
        if (!main) {
            return
        }

        const clickHandler = (sec: Topic)=> {
            setTopic(sec)
            refetch()
        }
        console.log("LOADING FAV TOPICS WITH", lista)
        const newTopicList = lista?.filter(t=> t?.fav !== false )
        console.log("FAV TOPIC LIST", newTopicList)

        return newTopicList?.map((sec:Topic, i:number) => {

            const deleteTopicHandler = ()=> {
                console.log("CLICK DELETE TOPIC")
                deleteTopicfunc(main?.userId, sec.id)
            }

            const addToFav = async()=> {
                if (!lista) {
                    return
                }
                const newTopic = await addTopicToFavs({variables:{topicId: sec.id}})
                const topicIndex = lista.findIndex(t => t.id === topic?.id)

                const newTopicList = [...lista];
                newTopicList[topicIndex] = newTopic.data.addTopicToFavs
                setLista(newTopicList)
            }

            return (
                <div key={i} className="topic-container">
                    {(deleteAlert === "topic") && <DeleteAlert setDeleteAlert={setDeleteAlert} deleteHandler={deleteTopicHandler} />}
                    <div className={"ss-ai-topic p"} onClick={()=>clickHandler(sec)}>{sec.name}</div>
                    {topic?.id === sec.id && <div className="topic-opt">
                        <div className="del-topic p" onClick={addToFav}>F</div>
                        <div className="del-topic p" onClick={()=>setDeleteAlert("topic")}>D</div>
                    </div>}
                </div>
            )
        })
    }

    const addTopicHandler = async (e: React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault()

        if (!main  || !data) {
            return
        }

        const variables = {aiId: main?.id, topic: {name: addTopic}}

        const newTopic = await createTopic({variables: variables})

        if (!lista || !newTopic.data) {
            return
        }

        let copied = [...lista, newTopic.data.createTopic]
        setLista(copied)
        setTopic(newTopic.data.createTopic)

        if (copied) {

            if (!main) {
                return
            } 
            setShow(false)

        }
    }   

    const addToFavs = async()=> {
        if (!aiList || !main) {
            return
        }
        const newAi = await addAiToFavs({variables:{aiId: main.id}})
        const aiIndex = aiList?.findIndex(ai=> ai.id === main.id)
        
        const newAiList = [...aiList]
        newAiList[aiIndex] = newAi.data.addAiToFavs
        setAiList(newAiList)
    }

    return (
        <div style={!showSS? {display:"none"} : {}} className="second-sidebar"> 
            {(deleteAlert === "ai") && <DeleteAlert setDeleteAlert={setDeleteAlert} deleteHandler={deleteAiHandler} />}
            <div className="ss-ai-container">
                <div className="ss-ai-title">{main && main.name}</div>
                <div className="ss-ai-op" >
                    <div className="ss-ai-op-del p" onClick={()=>setDeleteAlert("ai")}>D</div>
                    <div className="ss-ai-op-fav" onClick={addToFavs}>F</div>
                </div>
            </div>
            <div className="ss-add">
                <div className="ss-add-header">
                    <span className="ss-add-title">Topics</span>
                    <button className='ss-add-button' onClick={e=>setShow(!show)}>+</button>
                </div>
                {show && <form className='ss-form' action="" onSubmit={addTopicHandler}>
                    <input placeholder='topic' onChange={e=>setAddTopic(e.target.value)}></input>
                    <button type='submit'>ADD</button>
                </form>}
            </div>
            <div className="topic-wrapper">
                <div>favs</div>
                {loadFavSections()}
                <div className="div">No favs</div>
                {loadSections()} 
            </div>
        </div>
    )
}

export default SecSidebar