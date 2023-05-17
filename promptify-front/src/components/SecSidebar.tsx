import { useState, Dispatch, useEffect, useRef } from 'react'
import { useRouter } from "next/router"
import { AI, Topic, User, Card } from '../types'
import { GET_TOPICS, ADD_TOPIC, DELETE_TOPIC, DELETE_AI, ADD_AI_FAV, ADD_TOPIC_FAV, EDIT_AI } from '@/queries'
import { useQuery, useMutation } from '@apollo/client'
import DeleteAlert from './DeleteAlert'
import TopicComponent from './Topic'
import style from '../styles/secSidebar.module.css'

interface SecSideBarProps {
    me: User | undefined
    main: AI | undefined
    topic: Topic | undefined
    showSS: boolean
    aiList: AI[] | undefined
    profile: boolean
    signOff: ()=> void
    setAiList: Dispatch<AI[]>
    setTopic: Dispatch<Topic>
    setMain: Dispatch<AI>
    setToken: Dispatch<string | undefined>
    setShowSS: Dispatch<boolean>
    
    lista: Topic[] | undefined
    setLista: Dispatch<Topic[] | undefined>

    setCardList: Dispatch<Card[] | undefined>
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

const SecSidebar = ({me, main, topic, aiList, showSS, profile, signOff,  setTopic, setAiList, setMain, setToken, setShowSS, lista, setLista, setCardList}: SecSideBarProps)=> {
    const [addTopic,    setAddTopic]    = useState<string>("")
    const [show,        setShow]        = useState<boolean>(false)
    const [deleteAlert, setDeleteAlert] = useState<string>("none")

    // const [lista,       setLista]       = useState<Topic[] | undefined>(undefined)

    const [edit,        setEdit]        = useState<boolean>(false) 
    const [newTitle,    setNewTitle]    = useState<string | undefined>(main?.name)

    const router = useRouter()

    let isMobile: boolean

    if (typeof window !== "undefined") {
        isMobile = window.matchMedia("(max-width: 500px)").matches;
    }
    
    

    // USE QUERY

    const { data, refetch } = useQuery<topicListData, topicListVariables>(GET_TOPICS, {
        variables: { list: main?.topics }
    });


    // USE EFFECT    
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(()=> {
        if (data) {
            setLista(data.getTopics)
        }
    }, [data])

    useEffect(()=> {
        inputRef.current?.focus()
    },[edit])

    useEffect(()=> {
        setEdit(false)
        setNewTitle(main?.name)
    },[main])

    // MUTATIONS

    const [ createTopic, {loading: CTloading} ] = useMutation<addAiData, addTopicVariables>(ADD_TOPIC)
    const [ deleteTopic, {loading: DTloading} ] = useMutation(DELETE_TOPIC)
    const [ deleteAi, {loading: DAloading} ] = useMutation(DELETE_AI)
    const [ addAiToFavs, {loading: AATFloading} ] = useMutation(ADD_AI_FAV);
    const [ addTopicToFavs, {loading: ATTFloading} ] = useMutation(ADD_TOPIC_FAV)
    const [ editAi, {loading: EAloading} ] = useMutation(EDIT_AI)

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

    const deleteAiHandler = async ()=> {
        await deleteAifunc(main?.userId, main?.id)
        setDeleteAlert("none")
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

            if (topic?.id !== sec.id) {
                setCardList(undefined)
            }

            setTopic(sec)
            refetch()
            
            if (isMobile) {
                setShowSS(false)
            }
            
        }
        const newTopicList = lista?.filter(t=> t?.fav === false )

        return newTopicList?.map((sec:Topic, i:number) => 
            <TopicComponent 
                key={i}
                main={main}
                sec={sec}
                lista={lista}
                topic={topic}
                deleteAlert={deleteAlert}
                deleteTopicfunc={deleteTopicfunc}
                DTloading={DTloading}
                addTopicToFavs={addTopicToFavs}
                ATTFloading={ATTFloading}
                clickHandler={clickHandler}
                setLista={setLista}
                setTopic={setTopic}
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

            if (topic?.id !== sec.id) {
                setCardList(undefined)
            }

            refetch()
            

            if (isMobile) {
                setShowSS(false)
            }
        }
        const newTopicList = lista?.filter(t=> t?.fav !== false )

        return newTopicList?.map((sec:Topic, i:number) => 
            <TopicComponent 
                key={i}
                main={main}
                sec={sec}
                lista={lista}
                topic={topic}
                deleteAlert={deleteAlert}
                deleteTopicfunc={deleteTopicfunc}
                DTloading={DTloading}
                addTopicToFavs={addTopicToFavs}
                ATTFloading={ATTFloading}
                clickHandler={clickHandler}
                setLista={setLista}
                setTopic={setTopic}
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

    const editAiHandler = async() => {
        if (!aiList || !main || !newTitle) {
            return
        }

        if (main.name === newTitle) {
            setEdit(!edit)
            return
        }

        const newAi = await editAi({variables:{aiId:main.id, newName:newTitle}})
        const aiIndex = aiList?.findIndex(ai=> ai.id === main.id)
        const newMain = {...main, name: newAi.data.editAi.name}

        const newAiList = [...aiList]
        newAiList[aiIndex] = newAi.data.editAi.name
        setMain(newMain)
        setAiList(newAiList)
        setEdit(!edit)
    }

    const theresFavs = ()=> {
        return lista?.some(c => c.fav === true)
    }

    const setEditHandler = ()=> {
        setEdit(!edit)
    }

    // const signOff = ()=> {
    //     sessionStorage.clear()
    //     setToken(undefined)
    // }

    const doNothing = (e : any)=> {
        e.preventDefacult()
    }



    return (
        <div style={!showSS? {} : {}} className={showSS? style[`second-sidebar`] : `${style['second-sidebar']} ${style['hidden-bar']}`} > 
            {(deleteAlert === "ai") && <DeleteAlert setDeleteAlert={setDeleteAlert} deleteHandler={deleteAiHandler} loading={DAloading}/>}
            {profile && 
                <div className={style['profile-card']}>
                    <div className={style['profile-pic']}></div>
                    <div className={style['profile-name']}>{me?.name}</div>
                    <button className={style['sign-off']} onClick={signOff} type='button' title='Sign off'>Sign Off</button>
                </div>
            }
            {!profile && <div className={style[`ai-container`]}>
                {!edit && <div className={style[`ai-title`]}>{main && main.name}</div>}
                {edit && <input ref={inputRef} type={"text"} value={newTitle} placeholder={"edit name"} className={`${style[`ai-title`]} unset`} onChange={(e)=>setNewTitle(e.target.value)} minLength={1}></input>}
                {main && <div className={style[`ai-opt`]}>
                    {!edit && <div className={`${style[`del-ai`]} p`} onClick={()=>setDeleteAlert("ai")}></div> }
                    {!edit && <div className={`${style[`edit-ai`]} p`} onClick={setEditHandler}></div>}
                    {!edit && <div className={main?.fav? `${style[`fav-ai`]} ${style[`fav-ai-on`]} p` : `${style[`fav-ai`]} p` } onClick={AATFloading? doNothing : addToFavs}></div>}
                    {edit && <div onClick={EAloading? doNothing : editAiHandler}>YES</div>}
                    {edit && <div onClick={()=>setEdit(!edit)}>NO</div>}
                </div>}
            </div>}
            {!profile && <div className={style.addContainer}>
                <div className={style[`add-header`]}>
                    <span className={style[`add-title`]}>Topics</span>
                    <button className={style[`add-button`]} onClick={e=>setShow(!show)}>+</button>
                </div>
                {<form className={show ? style[`add-form`] : `${style['add-form']} ${style['hidden-form']}`} action="" onSubmit={CTloading? doNothing : addTopicHandler}>
                    <input placeholder='topic' onChange={e=>setAddTopic(e.target.value)} minLength={1} required></input>
                    <button type='submit'>ADD</button>
                </form>}
            </div>}
            {!profile && <div className={style[`topics-wrapper`]}>
                {theresFavs() && <div className={style['favs-title']}>Favourites</div>}
                {theresFavs() && <div className={style.topics}>{loadFavSections()}</div>}
                {theresFavs() && <div className="divisor"></div>}
                {lista === undefined && <div className={style.loading}></div>}
                {<div className={style.topics}>{loadSections()}</div>} 
            </div>}
        </div>
    )
}

export default SecSidebar