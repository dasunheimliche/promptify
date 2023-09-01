import React, { useState } from "react";

import { useRouter } from "next/router";

import { useQuery } from "@apollo/client";
import { ME, GET_AIS } from "@/queries";

import { Mains, Visibility } from "../types";
import { meData, aiListData, aiListVariables } from "../types";

import MainSidebar from "@/components/MainSidebar";
import SecondSidebar from "@/components/SecondSidebar";

import PromptSidebar from "@/components/PromptSidebar";

import AddAI from "@/components/AddMenu/AddAI";
import AddPrompt from "@/components/AddMenu/AddPrompt";
import AddStack from "@/components/AddMenu/AddStack";

import style from "../styles/me.module.css";
import MainContent from "@/components/MainContent";

export default function Me() {
  const [mains, setMains] = useState<Mains>({
    main: undefined,
    topic: undefined,
    currCard: undefined,
    profile: true,
  });

  const [visibility, setVisibility] = useState<Visibility>({
    showMenu: "none",
    showSS: true,
    showPS: false,
  });

  const router = useRouter();

  const { data: { me } = {} } = useQuery<meData>(ME);

  const { data: { getAis: aiList } = {} } = useQuery<
    aiListData,
    aiListVariables
  >(GET_AIS, {
    variables: { meId: me?.id },
    skip: !me?.id,
  });

  if (me === undefined) {
    return <div className={style.loading}></div>;
  }

  if (me === null) {
    router.push("/login");
  }

  return (
    <div className={style.main}>
      {visibility.showMenu !== "none" && (
        <div className={style[`opt-mode`]}>
          {visibility.showMenu === "add ai" && (
            <AddAI me={me} setVisibility={setVisibility} setMains={setMains} />
          )}
          {visibility.showMenu === "add prompt" && (
            <AddPrompt mains={mains} setVisibility={setVisibility} />
          )}
          {visibility.showMenu === "add stack" && (
            <AddStack mains={mains} setVisibility={setVisibility} />
          )}
        </div>
      )}

      {aiList === undefined && <div className={style.loading}></div>}

      <MainSidebar
        mains={mains}
        aiList={aiList}
        visibility={visibility}
        setMains={setMains}
        setVisibility={setVisibility}
      />
      <SecondSidebar
        key={mains.main?.id}
        me={me}
        mains={mains}
        aiList={aiList}
        visibility={visibility}
        setMains={setMains}
        setVisibility={setVisibility}
      />
      <MainContent
        mains={mains}
        visibility={visibility}
        setMains={setMains}
        setVisibility={setVisibility}
      />
      <PromptSidebar
        key={mains.currCard?.id}
        mains={mains}
        visibility={visibility}
        setVisibility={setVisibility}
        setMains={setMains}
      />
    </div>
  );
}
