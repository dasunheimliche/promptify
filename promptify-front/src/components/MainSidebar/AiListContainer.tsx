import { Dispatch } from "react";

import AiButton from "./AiButton";

import { AI, Mains, Visibility } from "@/types";

import style from "../../styles/mainSidebar.module.css";

interface AiListComponentProps {
  aiList: AI[] | undefined;
  mains: Mains;
  setMains: Dispatch<Mains>;
  visibility: Visibility;
  setVisibility: Dispatch<Visibility>;
  isFav: boolean;
}

export default function AiListComponent({
  aiList,
  mains,
  setMains,
  setVisibility,
  visibility,
  isFav,
}: AiListComponentProps) {
  const filteredAiList = aiList?.filter((ai: AI) =>
    isFav ? ai.fav === true : ai.fav !== true
  );

  return (
    <div className={style["ai-list"]}>
      {filteredAiList?.map((ai: AI) => {
        const handleClick = (ai: AI) => {
          setMains({ ...mains, main: { id: ai.id }, profile: false });

          if (visibility.showSS && mains.profile) {
            return;
          }

          if (visibility.showSS && ai.id !== mains.main?.id) {
            return;
          }

          if (visibility.showSS && ai.id === mains.main?.id) {
            setVisibility({ ...visibility, showSS: false });
            return;
          }

          if (!visibility.showSS) {
            setVisibility({ ...visibility, showSS: true });
          }
        };

        return (
          <AiButton
            key={ai.id}
            caption={ai.abb}
            isActive={mains.main?.id && ai.id === mains.main.id}
            onClick={() => handleClick(ai)}
          />
        );
      })}
    </div>
  );
}
