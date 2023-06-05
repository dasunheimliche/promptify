/* REACT IMPORTS */
import React, { useEffect, useState } from "react";

/* NEXTJS IMPORTS */
import { useRouter } from "next/router"

/* GRAPHQL/APOLLO IMPORTS */
import { useQuery, useApolloClient } from "@apollo/client"
import { ME } from '@/queries'

/* TYPES */

import { User, Topic, Card, AI, Mains } from '../types'

/* COMPONENTES */
import MainSidebar from "@/components/MainSidebar";
import SecSidebar from "@/components/SecSidebar";
import PromptSidebar from "@/components/PromptSidebar";

import MainContentMenu from "@/components/MainContentMenu";
import MainContentGrid from "@/components/MainContentGrid";

import AddAI from "@/components/AddAI";
import AddPrompt from "@/components/AddPrompt";
import AddStack from "@/components/AddStack";

/* STYLES */
import style from '../styles/me.module.css'

interface meData {
  me: User
}

export default function Me() {


  let tkn
  if (typeof window !== "undefined") {
    tkn = sessionStorage.getItem('user-token')
  }
  // const client = useApolloClient()

  const [mains, setMains] = useState<Mains>({main: undefined, topic: undefined, currCard: undefined, profile: true});

  // STATES WHICH CONTROLS VISIVILITY
  // const [visibility, setVisibility] = useState({showMenu:"none", showSS:true, showPS:false})

  const [showMenu, setShowMenu] = useState<string>("none")
  const [showSS,   setShowSS  ] = useState<boolean>(true)
  const [showPS,   setShowPS  ] = useState<boolean>(false)
  
  const [columns,  setColumns ] = useState<number>(3)
  
  // STATE WHICH SETS CURRENT USER
  const [me,       setMe]       = useState<User   | undefined>(undefined);
  const [token,    setToken]    = useState<string | undefined>(tkn? tkn : undefined)

  // STATES WICH CONTROLS ITEM LISTS
  const [aiList,   setAiList    ] = useState<AI[]    | undefined>(undefined)
  const [cardList, setCardList  ] = useState<Card[]  | undefined>(undefined)
  const [topicList, setTopicList] = useState<Topic[] | undefined>(undefined)

  // HOOKS
  const router = useRouter()

  // QUERIES
  const {data, refetch } = useQuery<meData>(ME)  

  // USE EFFECTS

  useEffect(()=> {
    const token: string | null = sessionStorage.getItem('user-token')
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

  const reef = async()=> {
    await refetch()
  }

  useEffect(()=> {
    reef()
    if (!token) {
        router.push("/login")
    } 
  }, [token]) // eslint-disable-line

  useEffect(()=> {
    if (showPS && showSS) {
      setColumns(2)
    } else if (!showPS && !showSS)  {
      setColumns(4)
    } else {
      setColumns(3)
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
          {showMenu === "add ai"      &&  <AddAI mains={mains}      aiList={aiList}      me={me}        setAiList={setAiList}      setShowMenu={setShowMenu}  setMains={setMains}  setMe={setMe}/>}
          {showMenu === "add prompt"  &&  <AddPrompt  cardList={cardList}  mains={mains}  setCardList={setCardList}  setShowMenu={setShowMenu}  setMains={setMains} />}
          {showMenu === "add stack"   &&  <AddStack   cardList={cardList}  mains={mains}  setCardList={setCardList}  setShowMenu={setShowMenu}  setMains={setMains} />}
        </div>
      }

      {aiList === undefined && <div className={style.loading}></div>}

      <MainSidebar 
        me           = {me          } 
        mains         = {mains       }
        aiList       = {aiList      }   
        topicList    = {topicList   } 
        showSS       = {showSS      } 
        setMains      = {setMains     } 
        setAiList    = {setAiList   } 
        setTopicList = {setTopicList}
        setShowSS    = {setShowSS   } 
        setShowMenu  = {setShowMenu } 
      />
      <SecSidebar 
        me           = {me          } 
 
        mains        = {mains       } 
        aiList       = {aiList      } 
        topicList    = {topicList   }
        showSS       = {showSS      } 
        setMe        = {setMe       }

        setMains     = {setMains    }
        setAiList    = {setAiList   } 
        setTopicList = {setTopicList} 
        setCardList  = {setCardList } 
        setShowSS    = {setShowSS   } 
        signOff      = {signOff     }
      />
      <div className={style[`main-content`]} >
        <MainContentMenu mains={mains} />
        <MainContentGrid 
          mains          = {mains} 
          cardList       = {cardList      } 
          columns        = {columns       } 
          setMains       = {setMains      }
          setCardList    = {setCardList   } 
          setShowPS      = {setShowPS     } 
          setShowMenu    = {setShowMenu   }
        />
      </div>
      <PromptSidebar mains={mains} setShowPS={setShowPS} showPS={showPS} setMains={setMains}/>
    </div>
  )
}