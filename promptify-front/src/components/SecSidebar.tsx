import { useState, Dispatch, useEffect } from 'react'
import { AI, Topic } from '../types'
import { GET_TOPICS, ADD_TOPIC, DELETE_TOPIC, DELETE_AI, ADD_AI_FAV, ADD_TOPIC_FAV } from '@/queries'
import { useQuery, useMutation } from '@apollo/client'
import DeleteAlert from './DeleteAlert'
import TopicComponent from './Topic'
import style from '../styles/secSidebar.module.css'

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

        return newTopicList?.map((sec:Topic, i:number) => 
            <TopicComponent 
                key={i}
                main={main}
                sec={sec}
                lista={lista}
                deleteAlert={deleteAlert}
                deleteTopicfunc={deleteTopicfunc}
                addTopicToFavs={addTopicToFavs}
                clickHandler={clickHandler}
                setLista={setLista}
                setDeleteAlert={setDeleteAlert}
            />
        )
    }

    const loadFavSections = ()=>{
        if (!main) {
            return
        }

        const clickHandler = (sec: Topic)=> {
            setTopic(sec)
            refetch()
        }
        const newTopicList = lista?.filter(t=> t?.fav !== false )

        return newTopicList?.map((sec:Topic, i:number) => 
            <TopicComponent 
                key={i}
                main={main}
                sec={sec}
                lista={lista}
                deleteAlert={deleteAlert}
                deleteTopicfunc={deleteTopicfunc}
                addTopicToFavs={addTopicToFavs}
                clickHandler={clickHandler}
                setLista={setLista}
                setDeleteAlert={setDeleteAlert}
            />
        )
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
        const newMain = {...main, fav: !main.fav}
        
        const newAiList = [...aiList]
        newAiList[aiIndex] = newAi.data.addAiToFavs
        setMain(newMain)
        setAiList(newAiList)
    }

    const theresFavs = ()=> {
        return lista?.some(c => c.fav === true)
    }

    return (
        <div style={!showSS? {display:"none"} : {}} className={style[`second-sidebar`]}> 
            {(deleteAlert === "ai") && <DeleteAlert setDeleteAlert={setDeleteAlert} deleteHandler={deleteAiHandler} />}
            <div className={style[`ai-container`]}>
                <div className={style[`ai-title`]}>{main && main.name}</div>
                {main && <div className={style[`ai-opt`]}>
                    <div className={`${style[`del-ai`]} p`} onClick={()=>setDeleteAlert("ai")}></div> 
                    <div className={main?.fav? `${style[`fav-ai`]} ${style[`fav-ai-on`]} p` : `${style[`fav-ai`]} p` } onClick={addToFavs}></div> 
                </div>}
            </div>
            <div className={style.addContainer}>
                <div className={style[`add-header`]}>
                    <span className={style[`add-title`]}>Topics</span>
                    <button className={style[`add-button`]} onClick={e=>setShow(!show)}>+</button>
                </div>
                {show && <form className={style[`add-form`]} action="" onSubmit={addTopicHandler}>
                    <input placeholder='topic' onChange={e=>setAddTopic(e.target.value)}></input>
                    <button type='submit'>ADD</button>
                </form>}
            </div>
            <div className={style[`topics-wrapper`]}>
                {theresFavs() && <div>Favourites</div>}
                {theresFavs() && loadFavSections()}
                <div className="divisor"></div>
                {loadSections()} 
            </div>
        </div>
    )
}

export default SecSidebar