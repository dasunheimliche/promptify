import { Dispatch } from "react";

import { Mains, Topic, Visibility } from "@/types";

import TopicComponent from "./Topic";

import style from "@/styles/secondSidebar.module.css";

interface TopicListProps {
  isFav: boolean;
  mains: Mains;
  setMains: Dispatch<Mains>;
  topicList: Topic[] | undefined;
  isMobile: boolean;
  visibility: Visibility;
  setVisibility: Dispatch<Visibility>;
}

export default function TopicList({
  isFav = false,
  mains,
  setMains,
  topicList,
  isMobile,
  visibility,
  setVisibility,
}: TopicListProps) {
  const handleClick = (sec: Topic) => {
    setMains({ ...mains, topic: { id: sec.id, aiId: sec.aiId } });

    if (isMobile) {
      setVisibility({ ...visibility, showSS: false });
    }
  };

  const newTopicList = topicList?.filter((t: Topic) =>
    isFav ? t?.fav !== false : t?.fav === false
  );

  return (
    <div className={style.topics}>
      {newTopicList?.map((sec: Topic, i: number) => (
        <TopicComponent
          key={i}
          sec={sec}
          topicList={topicList}
          mains={mains}
          onClick={() => handleClick(sec)}
          setMains={setMains}
        />
      ))}
    </div>
  );
}
