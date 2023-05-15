import { useEffect, useState } from "react";
import React from "react";

import MainSidebar from "@/components/MainSidebar";
import SecSidebar from "@/components/SecSidebar";
import PromptSidebar from "@/components/PromptSidebar";

import MainContentMenu from "@/components/MainContentMenu";
import MainContentGrid from "@/components/MainContentGrid";

import AddAI from "@/components/AddAI";
import AddPrompt from "@/components/AddPrompt";
import AddStack from "@/components/AddStack";

import { User, Topic, Card, AI } from '../types'

import { useAuth } from "@/contexts/Authcontext"
import { useRouter } from "next/router"
import { useQuery, useApolloClient } from "@apollo/client"

import { ME } from '@/queries'

import style from '../styles/me.module.css'

interface meData {
  me: User
}

export default function Me() {

  // const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  let tkn
  if (typeof window !== "undefined") {
    tkn = sessionStorage.getItem('user-token')
  }


  // STATES THAT CONTROLS ACTIVATED ITEMS
  const [main,     setMain]        = useState<AI    | undefined>(undefined)
  const [topic,    setTopic]       = useState<Topic | undefined>(undefined)
  const [currCard, setCurrentCard] = useState<Card  | undefined>(undefined)

  const [profile, setProfile] = useState<boolean>(true)

  // STATES WHICH CONTROLS VISIVILITY

  const [showMenu, setShowMenu]    = useState<string>("none")
  const [showSS,   setShowSS]      = useState<boolean>(true)
  const [showPS,   setShowPS]      = useState<boolean>(false)
  
  const [columns,  setColumns] = useState<number>(3)
  
  // STATE WHICH SETS CURRENT USER
  const [me,       setMe]          = useState<User   | undefined>(undefined);
  const [token, setToken]          = useState<string | undefined>(tkn? tkn : undefined)

  // STATES WICH CONTROLS ITEM LISTS
  const [aiList,   setAiList]      = useState<AI[]   | undefined>(undefined)
  const [cardList, setCardList]    = useState<Card[] | undefined>(undefined)
  const [lista,       setLista]       = useState<Topic[] | undefined>(undefined)

  const client = useApolloClient()

  // CUSTOM HOOKS
  const router = useRouter()

  // QUERIES
  const {loading, error, data, refetch } = useQuery<meData>(ME)  

  // USE EFFECTS


  useEffect(()=> {
    const token = sessionStorage.getItem('user-token')
    if (token === null) {
      return
    }    
    setToken(token)
    
  }, []) // eslint-disable-line


  useEffect(()=> {
    if (data) {
      setMe(data.me)
    }
  }, [data])

  useEffect(()=> {
    refetch()
    if (!token) {
        router.push("/login")
    } 
  }, [token]) // eslint-disable-line

  useEffect(()=> {
    if (showPS === true && showSS === true) {
      setTimeout(()=> {
        setColumns(2)
      }, 0)
    } else if (showPS === false && showSS === false)  {
      setTimeout(()=> {
        setColumns(4)
      }, 0)
      
    } else {
      setTimeout(()=> {
        setColumns(3)
      }, 0)
    }
  }, [showPS, showSS])

  const signOff = ()=> {
    sessionStorage.clear()
    setToken(undefined)
    // client.resetStore()
  }
  
  return (
    <div className={style.main}>
      {showMenu !== "none" && 
        <div className={style[`opt-mode`]}>
          {showMenu === "add ai"      &&  <AddAI      aiList={aiList}      me={me}        setAiList={setAiList}      setShowMenu={setShowMenu}  setMain={setMain}/>}
          {showMenu === "add prompt"  &&  <AddPrompt  cardList={cardList}  topic={topic}  setCardList={setCardList}  setShowMenu={setShowMenu}                   />}
          {showMenu === "add stack"   &&  <AddStack   cardList={cardList}  topic={topic}  setCardList={setCardList}  setShowMenu={setShowMenu}                   />}
        </div>
      }
      
      <MainSidebar aiList={aiList} me={me} main={main} showSS={showSS} profile={profile} setMain={setMain} setAiList={setAiList} setShowMenu={setShowMenu} setShowSS={setShowSS} setProfile={setProfile} setLista={setLista}/>
      <SecSidebar me={me} main={main} aiList={aiList} topic={topic} showSS={showSS} signOff={signOff} setToken={setToken} setTopic={setTopic} setAiList={setAiList} setMain={setMain} profile={profile} setShowSS={setShowSS} lista={lista} setLista={setLista}/>
      <div className={style[`main-content`]} >
        <MainContentMenu topic={topic} />
        <MainContentGrid cardList={cardList} currentCard={currCard} setCardList={setCardList} main={main} columns={columns} topic={topic && topic} setShowMenu={setShowMenu} setCurrentCard={setCurrentCard} setShowPS={setShowPS}/>
      </div>
      {/* {(currCard !== undefined && showPS == true) && <PromptSidebar currCard={currCard} setShowPS={setShowPS} showPS={showPS}/>} */}
      <PromptSidebar currCard={currCard} setShowPS={setShowPS} showPS={showPS} setCurrentCard={setCurrentCard}/>
    </div>
  )
}