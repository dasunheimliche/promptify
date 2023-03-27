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
import { useQuery } from "@apollo/client"

import { ME } from '@/queries'

interface meData {
  me: User
}

export default function Me() {

  const [deleteAlert, setDeleteAlert] = useState({delete:"", userId:"", aiId:"", topicId:"", cadrId:""})

  // STATES THAT CONTROLS ACTIVATED ITEMS
  const [main,     setMain]        = useState<AI    | undefined>(undefined)
  const [topic,    setTopic]       = useState<Topic | undefined>(undefined)
  const [currCard, setCurrentCard] = useState<Card  | undefined>(undefined)

  // STATES WHICH CONTROLS VISIVILITY

  const [showMenu, setShowMenu]    = useState<string>("none")
  const [showSS,   setShowSS]      = useState<boolean>(true)
  const [showPS,   setShowPS]      = useState<boolean>(false)
  
  const [columns,  setColumns] = useState<number>(3)

  const [panel, setPanel] = useState({topicPanel: true, promptPanel: false}
)
  // STATE WHICH SETS CURRENT USER
  const [me,       setMe]          = useState<User   | undefined>(undefined);

  // STATES WICH CONTROLS ITEM LISTS
  const [aiList,   setAiList]      = useState<AI[]   | undefined>(undefined)
  const [cardList, setCardList]    = useState<Card[] | undefined>(undefined)

  // CUSTOM HOOKS
  const {token, setToken} = useAuth()
  const router = useRouter()

  // QUERIES
  const {loading, error, data, refetch } = useQuery<meData>(ME)  

  // USE EFFECTS

  useEffect(()=> {
    const newToken = localStorage.getItem('user-token')
    
    if (newToken) {
      setToken(newToken)
    } 
  }, [])


  useEffect(()=> {
    if (data) {
      setMe(data.me)
    }
  }, [data])

  useEffect(()=> {
    if (!token) {
        router.push("/login")
    } 
  }, [token]) // eslint-disable-line

  useEffect(()=> {
    if (showPS === true && showSS === true) {
      setColumns(2)
    } else {
      setColumns(3)
    }
  }, [showPS, showSS])


  return (
    <div className='main'>
      {showMenu !== "none" && 
        <div className="opt-mode">
          {showMenu === "add ai"      &&  <AddAI      aiList={aiList}      me={me}        setAiList={setAiList}      setShowMenu={setShowMenu}  setMain={setMain}/>}
          {showMenu === "add prompt"  &&  <AddPrompt  cardList={cardList}  topic={topic}  setCardList={setCardList}  setShowMenu={setShowMenu}                   />}
          {showMenu === "add stack"   &&  <AddStack   cardList={cardList}  topic={topic}  setCardList={setCardList}  setShowMenu={setShowMenu}                   />}
        </div>
      }
      
      <MainSidebar aiList={aiList} me={me} main={main} showSS={showSS} setMain={setMain} setAiList={setAiList} setShowMenu={setShowMenu} setShowSS={setShowSS}/>
      <SecSidebar main={main} aiList={aiList} topic={topic} showSS={showSS} setTopic={setTopic} setAiList={setAiList} setMain={setMain}/>
      <div className="main-content">
        <MainContentMenu topic={topic} />
        <MainContentGrid cardList={cardList} setCardList={setCardList} main={main} columns={columns} topic={topic && topic} setShowMenu={setShowMenu} setCurrentCard={setCurrentCard} setShowPS={setShowPS}/>
      </div>
      {(currCard !== undefined && showPS == true) && <PromptSidebar currCard={currCard} setShowPS={setShowPS}/>}
    </div>
  )
}