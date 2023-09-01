import { Dispatch } from "react";

import { AI, User, Mains, Visibility } from "../types";

import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";

import style from "../styles/secondSidebar.module.css";
import Profile from "./SecondSidebar/Profile";
import SelectedAI from "./SecondSidebar/SelectedAI";

interface SecondSidebarProps {
  me: User | undefined;
  mains: Mains;
  visibility: Visibility;
  aiList: AI[] | undefined;
  setMains: Dispatch<Mains>;
  setVisibility: Dispatch<Visibility>;
}

export default function SecondSidebar({
  me,
  mains,
  aiList,
  visibility,
  setMains,
  setVisibility,
}: SecondSidebarProps) {
  const router = useRouter();
  const client = useApolloClient();

  const isProfileButtonActive = mains.profile;
  const isAiSelected = mains.main && !isProfileButtonActive;

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
      {isAiSelected && (
        <SelectedAI
          me={me}
          aiList={aiList}
          mains={mains}
          setMains={setMains}
          visibility={visibility}
          setVisibility={setVisibility}
        />
      )}
    </div>
  );
}
