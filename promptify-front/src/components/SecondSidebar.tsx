import { Dispatch } from "react";

import { AI, User, Mains, Visibility } from "../types";

import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";

import AiTitleSection from "./AiTitleSection";
import TopicsSection from "./TopicsSection";

import style from "../styles/secondSidebar.module.css";
import { Profile } from "./SecondSidebarModule";

interface SecondSidebarProps {
  me: User | undefined;
  mains: Mains;
  visibility: Visibility;
  aiList: AI[] | undefined;
  setMains: Dispatch<Mains>;
  setVisibility: Dispatch<Visibility>;
}

const SecondSidebar = ({
  me,
  mains,
  aiList,
  visibility,
  setMains,
  setVisibility,
}: SecondSidebarProps) => {
  const router = useRouter();
  const client = useApolloClient();

  const isProfileButtonActive = mains.profile;

  const handleSignOff = async () => {
    sessionStorage.clear();
    await client.resetStore();
    await client.cache.reset();
    router.push("/login");
  };

  return (
    <div
      className={
        visibility.showSS
          ? style[`second-sidebar`]
          : `${style["second-sidebar"]} ${style["hidden-sidebar"]}`
      }
    >
      {isProfileButtonActive && <Profile user={me} onSignOff={handleSignOff} />}

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
    </div>
  );
};

export default SecondSidebar;
