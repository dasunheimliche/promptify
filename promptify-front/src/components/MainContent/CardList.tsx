import { Card, Mains, Visibility } from "@/types";
import PromptCard from "../PromptCard";
import { Dispatch } from "react";

import style from "@/styles/mainContent.module.css";

interface CardListProps {
  cardList: Card[] | undefined;
  mains: Mains;
  visibility: Visibility;
  setVisibility: Dispatch<Visibility>;
  setMains: Dispatch<Mains>;
  isFav?: boolean;
}

export default function CardtList({
  cardList,
  mains,
  visibility,
  setVisibility,
  setMains,
  isFav = false,
}: CardListProps) {
  if (!mains || !cardList) {
    return null;
  }

  const filteredCardList = cardList.filter((c: Card) =>
    isFav ? c.fav === true : c.fav !== true
  );

  return (
    <div className={style.grid}>
      {filteredCardList
        .map((c: Card, i: number) => (
          <PromptCard
            key={i}
            card={c}
            visibility={visibility}
            mains={mains}
            setVisibility={setVisibility}
            setMains={setMains}
          />
        ))
        .reverse()}
    </div>
  );
}
