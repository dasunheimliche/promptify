import { Dispatch } from "react";

import { Mains, Visibility } from "@/types";

import MainContentMenu from "./MainContent/MainContentMenu";
import MainContentGrid from "./MainContent/MainContentGrid";

import style from "@/styles/me.module.css";

interface MainContentProps {
  mains: Mains;
  visibility: Visibility;
  setMains: Dispatch<Mains>;
  setVisibility: Dispatch<Visibility>;
}

export default function MainContent({
  mains,
  visibility,
  setMains,
  setVisibility,
}: MainContentProps) {
  return (
    <div className={style[`main-content`]}>
      <MainContentMenu mains={mains} />
      <MainContentGrid
        key={mains.topic?.id}
        mains={mains}
        visibility={visibility}
        setMains={setMains}
        setVisibility={setVisibility}
      />
    </div>
  );
}
