//** REACT IMPORTS
import React, { useEffect, useState } from "react";

//** CUSTOM HOOKS
import useColumns from '../hooks/useColumns'
import useIsUserLoggedIn from "@/hooks/useIsLogguedIn";

//** NEXTJS IMPORTS
import { useRouter } from "next/router"

//** GRAPHQL/APOLLO IMPORTS
import { useQuery, useApolloClient } from "@apollo/client"
import { ME } from '@/queries'

//** TYPES

import { User, Topic, Card, AI, Mains, Visibility } from '../types'

//** FUNCTIONS
import { getUserToken } from "@/utils/functions";

//** COMPONENTES
import MainSidebar     from "@/components/MainSidebar";
import SecSidebar      from "@/components/SecSidebar";
import PromptSidebar   from "@/components/PromptSidebar";
import MainContentMenu from "@/components/MainContentMenu";
import MainContentGrid from "@/components/MainContentGrid";
import AddAI           from "@/components/AddAI";
import AddPrompt       from "@/components/AddPrompt";
import AddStack        from "@/components/AddStack";

//** STYLES
import style from '../styles/me.module.css'

interface meData {
  me: User
}

export default function Me() {

  const [mains,      setMains      ] = useState<Mains>({main: undefined, topic: undefined, currCard: undefined, profile: true});
  const [visibility, setVisibility ] = useState<Visibility>({showMenu:"none", showSS:true, showPS:false})
  
  //** STATE WHICH SETS CURRENT USER
  const [me,         setMe        ] = useState<User    | undefined>(undefined);

  //** STATES WICH CONTROLS ITEM LISTS
  const [aiList,     setAiList    ] = useState<AI[]    | undefined>(undefined)
  const [cardList,   setCardList  ] = useState<Card[]  | undefined>(undefined)
  const [topicList,  setTopicList ] = useState<Topic[] | undefined>(undefined)

  //** HOOKS & CUSTOM HOOKS
  const router    = useRouter()
  const columns   = useColumns(visibility)
  const client    = useApolloClient()
  const isLoggued = useIsUserLoggedIn()

  //** QUERIES
  const { data, refetch } = useQuery<meData>(ME)  

  //** USE EFFECTS

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
    if (!isLoggued) {
        router.push("/login")
    } 
  }, [isLoggued]) // eslint-disable-line

  const signOff = ()=> {
    sessionStorage.clear()
    router.push("/login")
    client.resetStore()
  }
  
  return (
    <div className={style.main}>
      {visibility.showMenu !== "none" && 
        <div className={style[`opt-mode`]}>
          {visibility.showMenu === "add ai"      &&  <AddAI      aiList={aiList}      me={me}        setAiList={setAiList}     setVisibility={setVisibility}  setMains={setMains}  setMe={setMe}/>}
          {visibility.showMenu === "add prompt"  &&  <AddPrompt  cardList={cardList}  mains={mains}  setCardList={setCardList} setVisibility={setVisibility}  setMains={setMains} />}
          {visibility.showMenu === "add stack"   &&  <AddStack   cardList={cardList}  mains={mains}  setCardList={setCardList} setVisibility={setVisibility}  setMains={setMains} />}
        </div>
      }

      {aiList === undefined && <div className={style.loading}></div>}

      <MainSidebar 
        me            = {me           } 
        mains         = {mains        }
        aiList        = {aiList       }   
        topicList     = {topicList    } 
        setMains      = {setMains     } 
        setAiList     = {setAiList    } 
        setTopicList  = {setTopicList } 
        visibility    = {visibility   }
        setVisibility = {setVisibility}
      />
      <SecSidebar 
        me            = {me           } 
        mains         = {mains        } 
        aiList        = {aiList       } 
        topicList     = {topicList    }
        visibility    = {visibility   } 
        setMe         = {setMe        }
        setMains      = {setMains     }
        setAiList     = {setAiList    } 
        setTopicList  = {setTopicList } 
        setCardList   = {setCardList  } 
        setVisibility = {setVisibility} 
        signOff       = {signOff      }
      />
      <div className={style[`main-content`]} >
        <MainContentMenu mains={mains} />
        <MainContentGrid 
          mains          = {mains        } 
          cardList       = {cardList     } 
          columns        = {columns      } 
          visibility     = {visibility   }
          setMains       = {setMains     }
          setCardList    = {setCardList  } 
          setVisibility  = {setVisibility}
        />
      </div>
      <PromptSidebar mains={mains} setVisibility={setVisibility} visibility={visibility} setMains={setMains}/>
    </div>
  )
}