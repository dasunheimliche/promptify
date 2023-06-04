/* REACT IMPORTS */
import React, { useEffect, useState } from "react";

/* NEXTJS IMPORTS */
import { useRouter } from "next/router"

/* GRAPHQL/APOLLO IMPORTS */
import { useQuery, useApolloClient } from "@apollo/client"
import { ME } from '@/queries'

/* TYPES */

import { User, Topic, Card, AI } from '../types'

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
  const client = useApolloClient()

  // STATES THAT CONTROLS ACTIVATED ITEMS
  const [main,     setMain]        = useState<AI    | undefined>(undefined)
  const [topic,    setTopic]       = useState<Topic | undefined>(undefined)
  const [currCard, setCurrentCard] = useState<Card  | undefined>(undefined)

  const [profile, setProfile] = useState<boolean>(true)

  // STATES WHICH CONTROLS VISIVILITY

  const [showMenu, setShowMenu] = useState<string>("none")
  const [showSS,   setShowSS]   = useState<boolean>(true)
  const [showPS,   setShowPS]   = useState<boolean>(false)
  
  const [columns,  setColumns]  = useState<number>(3)
  
  // STATE WHICH SETS CURRENT USER
  const [me,       setMe]       = useState<User   | undefined>(undefined);
  const [token,    setToken]    = useState<string | undefined>(tkn? tkn : undefined)

  // STATES WICH CONTROLS ITEM LISTS
  const [aiList,   setAiList]   = useState<AI[]   | undefined>(undefined)
  const [cardList, setCardList] = useState<Card[] | undefined>(undefined)
  const [lista,    setLista]    = useState<Topic[] | undefined>(undefined)

  // CUSTOM HOOKS
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
          {showMenu === "add ai"      &&  <AddAI      aiList={aiList}      me={me}        setAiList={setAiList}      setShowMenu={setShowMenu}  setMain={setMain}  setMe={setMe}/>}
          {showMenu === "add prompt"  &&  <AddPrompt  cardList={cardList}  topic={topic}  setCardList={setCardList}  setShowMenu={setShowMenu}  setTopic={setTopic} />}
          {showMenu === "add stack"   &&  <AddStack   cardList={cardList}  topic={topic}  setCardList={setCardList}  setShowMenu={setShowMenu}  setTopic={setTopic} />}
        </div>
      }

      {aiList === undefined && <div className={style.loading}></div>}

      <MainSidebar 
        me          = {me         } 
        main        = {main       }
        profile     = {profile    }
        aiList      = {aiList     }   
        lista       = {lista      } 
        showSS      = {showSS     } 
        setMain     = {setMain    }
        setTopic    = {setTopic   } 
        setProfile  = {setProfile }  
        setAiList   = {setAiList  } 
        setLista    = {setLista   }
        setShowSS   = {setShowSS  } 
        setShowMenu = {setShowMenu} 
      />
      <SecSidebar 
        me          = {me         } 
        main        = {main       } 
        topic       = {topic      } 
        profile     = {profile    } 
        aiList      = {aiList     } 
        lista       = {lista      }
        showSS      = {showSS     } 
        setMe       = {setMe      }
        setMain     = {setMain    }
        setTopic    = {setTopic   }
        setAiList   = {setAiList  } 
        setLista    = {setLista   } 
        setCardList = {setCardList} 
        setShowSS   = {setShowSS  } 
        signOff     = {signOff    }
      />
      <div className={style[`main-content`]} >
        <MainContentMenu topic={topic} />
        <MainContentGrid 
          main           = {main          } 
          topic          = {topic && topic} 
          currentCard    = {currCard      } 
          profile        = {profile       } 
          cardList       = {cardList      } 
          columns        = {columns       } 
          setTopic       = {setTopic      }
          setCurrentCard = {setCurrentCard} 
          setCardList    = {setCardList   } 
          setShowPS      = {setShowPS     } 
          setShowMenu    = {setShowMenu   }
        />
      </div>
      <PromptSidebar currCard={currCard} setShowPS={setShowPS} showPS={showPS} setCurrentCard={setCurrentCard}/>
    </div>
  )
}