import { AI, Mains, User, Visibility } from "@/types";
import AiTitleSection from "./SelectedAI/AiTitleSection";
import TopicsSection from "./SelectedAI/TopicsSection";
import { Dispatch } from "react";

interface SelectedAI {
  me: User | undefined;
  aiList: AI[] | undefined;
  mains: Mains;
  visibility: Visibility;
  setMains: Dispatch<Mains>;
  setVisibility: Dispatch<Visibility>;
}

export default function SelectedAI({
  me,
  aiList,
  mains,
  setMains,
  setVisibility,
  visibility,
}: SelectedAI) {
  return (
    <>
      <AiTitleSection
        me={me}
        aiList={aiList}
        mains={mains}
        setMains={setMains}
      />
      <TopicsSection
        key={mains.main?.id}
        mains={mains}
        setMains={setMains}
        setVisibility={setVisibility}
        visibility={visibility}
      />
    </>
  );
}
