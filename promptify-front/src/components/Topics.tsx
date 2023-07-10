import style from '../styles/secSidebar.module.css'

import { Dispatch, useState } from 'react'
import { useQuery ,useMutation } from '@apollo/client'

import { theresFavs, doNothing } from '@/utils/functions'
import { Mains, Topic, Visibility, topicListData, topicListVariables  } from '@/types'

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

interface TopicsProps {
    mains: Mains
    visibility: Visibility
    setMains: Dispatch<Mains>
    setVisibility: Dispatch<Visibility>
}

const Topics = ({mains, setMains, setVisibility, visibility} : TopicsProps)=> {
    const [addTopic, setAddTopic] = useState<string>("")
    const [show    , setShow    ] = useState<boolean>(false)

    const isMobile = typeof window !== "undefined" ? window.matchMedia("(max-width: 500px)").matches : false;

    const { data: { getTopics: topicList } = {} } = useQuery<topicListData, topicListVariables>(GET_TOPICS, {
        variables: { mainId: mains.main?.id },
        skip: !mains.main
    });

    const [ createTopic,    {loading: CTloading}   ] = useMutation<addAiData, addTopicVariables>(ADD_TOPIC, {
        update: (cache, response) => {
            cache.updateQuery({query: GET_TOPICS, variables: { mainId: mains.main?.id }}, ({ getTopics })=> {
                return {
                    getTopics: getTopics.concat(response.data?.createTopic)
                }
            })
        }
    })

    const loadSections = (isFav = false) => {

        if (!mains.main) return

        const clickHandler = (sec: Topic) => {
      
            setMains({ ...mains, topic: {id:sec.id, aiId: sec.aiId} });
        
            if (isMobile) {
                setVisibility({ ...visibility, showSS: false });
            }
        };
      
        const newTopicList = topicList?.filter((t: Topic) => (isFav ? t?.fav !== false : t?.fav === false));
      
        return newTopicList?.map((sec: Topic, i: any) => (
            <TopicComponent
                key={i}
                sec={sec}
                topicList={topicList}
                mains={mains}
                clickHandler={clickHandler}
                setMains={setMains}
            />
        ));
    };

    const addTopicHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
        
            if (!mains.main) return
            
            const variables = { aiId: mains.main.id, topic: { name: addTopic } };
        
            const newTopic = await createTopic({ variables: variables });
        
            if (!newTopic.data) return
        
            setMains({ ...mains, topic: {id: newTopic.data.createTopic.id, aiId: newTopic.data.createTopic.aiId} });
            setAddTopic("");
            setShow(false);

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
                    <button className={style[`add-button`]} onClick={()=>setShow(!show)}>{show?"─" :"+"}</button>
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