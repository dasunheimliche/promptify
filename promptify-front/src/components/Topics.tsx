import style from '../styles/secSidebar.module.css'

import { useState } from 'react'
import { useMutation } from '@apollo/client'

import { theresFavs, doNothing } from '@/utils/functions'
import { Topic,  } from '@/types'

import TopicComponent from './Topic'

import { GET_TOPICS, ADD_TOPIC } from '@/queries'

interface addAiData {
    createTopic: Topic
}
interface addTopicVariables {
    aiId: string
    topic: {
        name: string
    }
}

const Topics = ({mains, setMains, currentAI, topicList, setVisibility, visibility, deleteAlert, setDeleteAlert} : any)=> {
    const [addTopic,    setAddTopic   ] = useState<string>("")
    const [show, setShow] = useState<boolean>(false)
    const [toDelete, setToDelete] = useState<Topic | undefined>(undefined)

    let isMobile: boolean

    if (typeof window !== "undefined") {
        isMobile = window.matchMedia("(max-width: 500px)").matches;
    }

    const [ createTopic,    {loading: CTloading}   ] = useMutation<addAiData, addTopicVariables>(ADD_TOPIC, {
        update: (cache, response) => {
            cache.updateQuery({query: GET_TOPICS, variables: { mainId: currentAI?.id }}, ({ getTopics })=> {
                return {
                    getTopics: getTopics.concat(response.data?.createTopic)
                }
            })
        }
    })


    const loadSections = (isFav = false) => {
        if (!mains.main) {
          return;
        }
      
        const clickHandler = (sec: Topic) => {
      
          setMains({ ...mains, topic: sec });
      
          if (isMobile) {
            setVisibility({ ...visibility, showSS: false });
          }
        };
      
        const newTopicList = topicList?.filter((t: Topic) => (isFav ? t?.fav !== false : t?.fav === false));
      
        return newTopicList?.map((sec: Topic, i: any) => (
            <TopicComponent
                key={i}
                toDelete={toDelete}
                setToDelete={setToDelete}
                currentAI = {currentAI}
                sec={sec}
                topicList={topicList}
                mains={mains}
                deleteAlert={deleteAlert}
                clickHandler={clickHandler}
                setMains={setMains}
                setDeleteAlert={setDeleteAlert}
            />
        ));
    };

    const addTopicHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
        
            if (!mains.main) {
                return;
            }
        
            const variables = { aiId: mains.main?.id, topic: { name: addTopic } };
        
            const newTopic = await createTopic({ variables: variables });
        
            if (!topicList || !newTopic.data) {
                return;
            }
        
            let copied = [...topicList, newTopic.data.createTopic];
            setMains({ ...mains, topic: newTopic.data.createTopic });
            setAddTopic("");
        
            let m = { ...mains.main };
            m.topics = m.topics?.concat(newTopic.data.createTopic.id);
        
            setMains({ ...mains, main: m });
        
            if (copied) {
                if (!mains.main) {
                return;
                }
                setShow(false);
            }
        } catch (error) {
            console.error('An error occurred while adding the topic:', error);
        }
    };

    if (mains.profile) return null

    return(
        <>
            <div className={style.addContainer}>
                <div className={style[`add-header`]}>
                    <span className={style[`add-title`]}>Topics</span>
                    <button className={style[`add-button`]} onClick={e=>setShow(!show)}>+</button>
                </div>

                {<form className={show ? style[`add-form`] : `${style['add-form']} ${style['hidden-form']}`} action="" onSubmit={CTloading? doNothing : addTopicHandler}>
                    <input placeholder='new topic' value={addTopic} onChange={e=>setAddTopic(e.target.value)} minLength={1} required></input>
                    <button type='submit'>ADD</button>
                </form>}
            </div>

            <div className={style[`topics-wrapper`]}>
                {theresFavs(topicList) && <div className={style['favs-title']}>Favourites</div>}
                {theresFavs(topicList) && <div className={style.topics}>{loadSections(true)}</div>}
                {theresFavs(topicList) && <div className="divisor"></div>}
                {topicList === undefined && <div className={style.loading}></div>}
                {<div className={style.topics}>{loadSections()}</div>} 
            </div>
        </>
    )
}

export default Topics