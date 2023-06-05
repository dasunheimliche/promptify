import { useState, Dispatch, useEffect, useRef } from 'react'
import { useRouter } from "next/router"

import { AI, Topic, User, Card, Mains } from '../types'

import { useQuery, useMutation } from '@apollo/client'
import { GET_TOPICS, ADD_TOPIC, DELETE_TOPIC, DELETE_AI, ADD_AI_FAV, ADD_TOPIC_FAV, EDIT_AI } from '@/queries'

import DeleteAlert from './DeleteAlert'
import TopicComponent from './Topic'

import style from '../styles/secSidebar.module.css'

interface SecSideBarProps {
    me: User | undefined

    mains: Mains
    showSS: boolean
    aiList: AI[] | undefined
    signOff: ()=> void
    setAiList: Dispatch<AI[]>
    setMains: Dispatch<Mains>

    setShowSS: Dispatch<boolean>
    setMe: Dispatch<User>
    
    topicList: Topic[] | undefined
    setTopicList: Dispatch<Topic[] | undefined>
    setCardList: Dispatch<Card[] | undefined>
} 
interface topicListData {
    getTopics: Topic[]
}
// interface topicListVariables {
//     list: string[] | undefined
// }
interface topicListVariables {
    mainId: string | undefined
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

const SecSidebar = ({me, mains, aiList, showSS, signOff,  setMains, setAiList, setMe, setShowSS, topicList, setTopicList, setCardList}: SecSideBarProps)=> {
    const [addTopic,    setAddTopic]    = useState<string>("")
    const [show,        setShow]        = useState<boolean>(false)
    const [deleteAlert, setDeleteAlert] = useState<string>("none")

    const [edit,        setEdit]        = useState<boolean>(false) 
    const [newTitle,    setNewTitle]    = useState<string | undefined>(mains.main?.name)

    const router = useRouter()

    let isMobile: boolean

    if (typeof window !== "undefined") {
        isMobile = window.matchMedia("(max-width: 500px)").matches;
    }
    
    

    // USE QUERY

    // const { data, refetch } = useQuery<topicListData, topicListVariables>(GET_TOPICS, {
    //     variables: { list: main?.topics }
    // });

    const { data, refetch } = useQuery<topicListData, topicListVariables>(GET_TOPICS, {
        variables: { mainId: mains.main?.id }
    });


    // USE EFFECT    
    const inputRef = useRef<HTMLInputElement>(null)

    const reff = async()=> {
        refetch()
    }

    useEffect(()=> {
        reff()
    }, [showSS, topicList])

    

    useEffect(()=> {
        if (data) {
            setTopicList(data.getTopics)
        }
    }, [data?.getTopics])

    useEffect(()=> {
        inputRef.current?.focus()
    },[edit])

    useEffect(()=> {
        setEdit(false)
        setNewTitle(mains.main?.name)
    },[mains.main])

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
        if (!me) {
            return
        }

        await deleteAi({variables: {userId, aiId}})
        if (!aiList) return
        const newAiList = aiList.filter(arrayAi => arrayAi.id != aiId)
        setAiList(newAiList)
        if (newAiList.length === 0) {
            return
        } else {
            setMains({...mains, main: newAiList[0]})
            setDeleteAlert("none")
        }

        let u = {...me}
        let a = u.allPrompts?.filter(id=> id != aiId)
        u.allPrompts = a
        setMe(u)
    }

    const deleteAiHandler = async ()=> {
        await deleteAifunc(mains.main?.userId, mains.main?.id)
        setDeleteAlert("none")
    }

    const deleteTopicfunc = async (aiId:string, topicId:string)=> {

        await deleteTopic({variables: {aiId, topicId}})

        if (!topicList) {
            return
        }

        if (!mains.main) {
            return
        }

        let m = {...mains.main}
        let t = m.topics?.filter(id => id !== topicId)
        m.topics = t

        setMains({...mains, main: m})

        const newTopic = topicList.filter(arrayTopic => arrayTopic.id !== topicId)
        setTopicList(newTopic)

        if (mains.topic?.id === topicId) {
            setMains({...mains, topic: newTopic[0]})
        }
    }

    const loadSections = ()=>{
        if (!mains.main) {
            return
        }

        const clickHandler = (sec: Topic)=> {

            if (mains.topic?.id !== sec.id) {
                setCardList(undefined)
            }

            setMains({...mains, topic: sec})
            refetch()
            
            if (isMobile) {
                setShowSS(false)
            }
            
        }
        const newTopicList = topicList?.filter(t=> t?.fav === false )

        return newTopicList?.map((sec:Topic, i:number) => 
            <TopicComponent 
                key={i}
                sec={sec}
                topicList={topicList}
                mains={mains}
                deleteAlert={deleteAlert}
                deleteTopicfunc={deleteTopicfunc}
                DTloading={DTloading}
                addTopicToFavs={addTopicToFavs}
                ATTFloading={ATTFloading}
                clickHandler={clickHandler}
                setTopicList={setTopicList}
                setMains={setMains}
                setDeleteAlert={setDeleteAlert}
            />
        )
    }

    const loadFavSections = ()=>{
        if (!mains.main) {
            return
        }

        const clickHandler = (sec: Topic)=> {
            setMains({...mains, topic: sec})

            if (mains.topic?.id !== sec.id) {
                setCardList(undefined)
            }

            refetch()
            

            if (isMobile) {
                setShowSS(false)
            }
        }
        const newTopicList = topicList?.filter(t=> t?.fav !== false )

        return newTopicList?.map((sec:Topic, i:number) => 
            <TopicComponent 
                key={i}
                sec={sec}
                topicList={topicList}
                mains={mains}
                deleteAlert={deleteAlert}
                deleteTopicfunc={deleteTopicfunc}
                DTloading={DTloading}
                addTopicToFavs={addTopicToFavs}
                ATTFloading={ATTFloading}
                clickHandler={clickHandler}
                setTopicList={setTopicList}
                setMains={setMains}
                setDeleteAlert={setDeleteAlert}
            />
        )
    }

    const addTopicHandler = async (e: React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault()

        if (!mains.main  || !data) {
            return
        }

        const variables = {aiId: mains.main?.id, topic: {name: addTopic}}

        const newTopic = await createTopic({variables: variables})

        if (!topicList || !newTopic.data) {
            return
        }

        let copied = [...topicList, newTopic.data.createTopic]
        setTopicList(copied)
        setMains({...mains, topic: newTopic.data.createTopic})
        setAddTopic("")

        let m = {...mains.main}
        m.topics = m.topics?.concat(newTopic.data.createTopic.id)

        setMains({...mains, main: m})

        if (copied) {

            if (!mains.main) {
                return
            } 
            setShow(false)

        }

    }   

    const addToFavs = async()=> {
        if (!aiList || !mains.main) {
            return
        }
        const newAi = await addAiToFavs({variables:{aiId: mains.main.id}})
        const aiIndex = aiList?.findIndex(ai=> ai.id === mains.main?.id)
        const newMain = {...mains.main, fav: !mains.main.fav}
        
        const newAiList = [...aiList]
        newAiList[aiIndex] = newAi.data.addAiToFavs
        setMains({...mains, main: newMain})
        setAiList(newAiList)
    }

    const editAiHandler = async() => {
        if (!aiList || !mains.main || !newTitle) {
            return
        }

        if (mains.main.name === newTitle) {
            setEdit(!edit)
            return
        }

        const newAi = await editAi({variables:{aiId: mains.main.id, newName:newTitle}})
        const aiIndex = aiList?.findIndex(ai=> ai.id === mains.main?.id)
        const newMain = {...mains.main, name: newAi.data.editAi.name}
        const newAiList = [...aiList]
        newAiList[aiIndex] = newAi.data.editAi
        setMains({...mains, main: newMain})
        setAiList(newAiList)
        setEdit(!edit)
    }

    const theresFavs = ()=> {
        return topicList?.some(c => c.fav === true)
    }

    const setEditHandler = ()=> {
        setEdit(!edit)
    }

    const doNothing = (e : any)=> {
        e.preventDefacult()
    }



    return (
        <div style={!showSS? {} : {}} className={showSS? style[`second-sidebar`] : `${style['second-sidebar']} ${style['hidden-bar']}`} > 
            {(deleteAlert === "ai") && <DeleteAlert setDeleteAlert={setDeleteAlert} deleteHandler={deleteAiHandler} loading={DAloading}/>}
            {mains.profile && 
                <div className={style['profile-card']}>
                    {/* <div className={style['profile-pic']}></div> */}
                    <div className={style['profile-name']}>{me?.name}</div>
                    <button className={style['sign-off']} onClick={signOff} type='button' title='Sign off'>Sign Off</button>
                </div>
            }
            {!mains.profile && <div className={style[`ai-container`]}>
                {!edit && <div className={style[`ai-title`]}>{mains.main && mains.main.name}</div>}
                {edit && <input ref={inputRef} type={"text"} value={newTitle} placeholder={"edit name"} className={`${style[`ai-title`]} unset`} onChange={(e)=>setNewTitle(e.target.value)} minLength={1}></input>}
                {mains.main && <div className={style[`ai-opt`]}>
                    {!edit && <div className={`${style[`del-ai`]} p`} onClick={()=>setDeleteAlert("ai")}></div> }
                    {!edit && <div className={`${style[`edit-ai`]} p`} onClick={setEditHandler}></div>}
                    {!edit && <div className={mains.main?.fav? `${style[`fav-ai`]} ${style[`fav-ai-on`]} p` : `${style[`fav-ai`]} p` } onClick={AATFloading? doNothing : addToFavs}></div>}
                    {edit && <div className={`${style.yes} p`} onClick={EAloading? doNothing : editAiHandler}>✓</div>}
                    {edit && <div className={`${style.not} p`} onClick={()=>setEdit(!edit)}>✕</div>}
                </div>}
            </div>}
            {!mains.profile && <div className={style.addContainer}>
                <div className={style[`add-header`]}>
                    <span className={style[`add-title`]}>Topics</span>
                    <button className={style[`add-button`]} onClick={e=>setShow(!show)}>+</button>
                </div>
                {<form className={show ? style[`add-form`] : `${style['add-form']} ${style['hidden-form']}`} action="" onSubmit={CTloading? doNothing : addTopicHandler}>
                    <input placeholder='topic' value={addTopic} onChange={e=>setAddTopic(e.target.value)} minLength={1} required></input>
                    <button type='submit'>ADD</button>
                </form>}
            </div>}
            {!mains.profile && <div className={style[`topics-wrapper`]}>
                {theresFavs() && <div className={style['favs-title']}>Favourites</div>}
                {theresFavs() && <div className={style.topics}>{loadFavSections()}</div>}
                {theresFavs() && <div className="divisor"></div>}
                {topicList === undefined && <div className={style.loading}></div>}
                {<div className={style.topics}>{loadSections()}</div>} 
            </div>}
        </div>
    )
}

export default SecSidebar