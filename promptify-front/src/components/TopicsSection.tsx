import style from '../styles/secondSidebar.module.css'

import { Dispatch, useState } from 'react'
import { useQuery ,useMutation } from '@apollo/client'

import { theresFavs } from '@/utils/functions'
import { Mains, Topic, Visibility, topicListData, topicListVariables  } from '@/types'

import { GET_TOPICS, ADD_TOPIC } from '@/queries'

import { NewTopicInput, TopicList } from './SecondSidebarModule'

import favIcon from '../icons/fav-on.png'

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

const TopicsSection = ({mains, setMains, setVisibility, visibility} : TopicsProps)=> {
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
            <NewTopicInput 
                newTopic={addTopic}
                isShown={show}
                isMutating={CTloading}
                onOpenInput={()=>setShow(!show)}
                onAddTopic={addTopicHandler}
                onTyping={e=>setAddTopic(e.target.value)}
            />

            <div className={style['topics-wrapper']}>
                {theresFavs(topicList) &&
                    <TopicList
                        isFav={true}
                        mains={mains}
                        setMains={setMains}
                        topicList={topicList}
                        isMobile={isMobile}
                        visibility={visibility}
                        setVisibility={setVisibility}
                    />
                }
                {theresFavs(topicList) && <div className="divisor"></div>}
                
                {topicList === undefined && <div className={style.loading}></div>}
                
                <TopicList
                    isFav={false}
                    mains={mains}
                    setMains={setMains}
                    topicList={topicList}
                    isMobile={isMobile}
                    visibility={visibility}
                    setVisibility={setVisibility}
                />
            </div>
        </>
    )
}

export default TopicsSection