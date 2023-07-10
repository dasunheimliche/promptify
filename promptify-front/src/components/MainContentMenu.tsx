import style from '../styles/mainContent.module.css'

import { useQuery } from '@apollo/client'

import { Mains, Topic, topicListData, topicListVariables } from '../types'
import { GET_TOPICS } from '@/queries'

interface MainContentMenu {
    mains: Mains
}


const MainContentMenu = ({mains} : MainContentMenu )=> {

    const { data: { getTopics: topicList } = {} } = useQuery<topicListData, topicListVariables>(GET_TOPICS, {
        variables: { mainId: mains.main?.id },
        skip: !mains.main
      });

    const currentTopic = topicList?.find((topic: Topic) => topic.id === mains.topic?.id)

    return (
        <div className={style.header}>
            <div className={style[`header-title`]}>{currentTopic?.name}</div> 
        </div>
    )
}

export default MainContentMenu