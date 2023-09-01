import { useQuery } from "@apollo/client";

import { GET_TOPICS } from "@/queries";
import { Mains, Topic, topicListData, topicListVariables } from "@/types";

import style from "@/styles/mainContent.module.css";

interface MainContentMenu {
  mains: Mains;
}

export default function MainContentMenu({ mains }: MainContentMenu) {
  const { data: { getTopics: topicList } = {} } = useQuery<
    topicListData,
    topicListVariables
  >(GET_TOPICS, {
    variables: { mainId: mains.main?.id },
    skip: !mains.main,
  });

  const currentTopic = topicList?.find(
    (topic: Topic) => topic.id === mains.topic?.id
  );

  return (
    <div className={style.header}>
      <div className={style[`header-title`]}>{currentTopic?.name}</div>
    </div>
  );
}
