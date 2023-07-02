//** REACT IMPORTS
import React, { useEffect, useState } from "react";

//** CUSTOM HOOKS
import useColumns from '../hooks/useColumns'
import useIsUserLoggedIn from "@/hooks/useIsLogguedIn";

//** NEXTJS IMPORTS
import { useRouter } from "next/router"

//** GRAPHQL/APOLLO IMPORTS
import { useQuery, useApolloClient } from "@apollo/client"
import { ME, GET_AIS, GET_TOPICS } from '@/queries'

//** TYPES

import { User, Topic, Card, AI, Mains, Visibility } from '../types'

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

interface aiListData {
  getAis: AI[]
}

interface aiListVariables {
  meId: string | undefined
}

interface topicListData {
  getTopics: Topic[]
}

interface topicListVariables {
  mainId: string | undefined
}

export default function Me() {

  const [mains,      setMains      ] = useState<Mains>({main: undefined, topic: undefined, currCard: undefined, profile: true});
  const [visibility, setVisibility ] = useState<Visibility>({showMenu:"none", showSS:true, showPS:false})
  
  //** STATE WHICH SETS CURRENT USER
  const { data: meData, refetch: meRefetch } = useQuery<meData>(ME)  
  const me = meData?.me

  //** STATES WICH CONTROLS ITEM LISTS

  const { data: aiData} = useQuery<aiListData, aiListVariables>(GET_AIS, {
    variables: {meId: me?.id},
    skip: !me?.id,
  });
  const aiList = aiData?.getAis

  // const { data: topicData } = useQuery<topicListData, topicListVariables>(GET_TOPICS, {
  //   variables: { mainId: mains.main?.id },
  //   skip: !mains.main?.id
  // });
  // const topicList = topicData?.getTopics

  const [cardList,   setCardList  ] = useState<Card[]  | undefined>(undefined)
  const [topicList,  setTopicList ] = useState<Topic[] | undefined>(undefined)

  //** HOOKS & CUSTOM HOOKS
  const router    = useRouter()
  const columns   = useColumns(visibility)
  const client    = useApolloClient()
  const isLoggued = useIsUserLoggedIn()

  //** QUERIES
 

  //** USE EFFECTS

  const reef = async()=> {
    await meRefetch()
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
          {visibility.showMenu === "add ai"      &&  <AddAI      aiList={aiList}      me={me}        setVisibility={setVisibility}  setMains={setMains}   />}
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
        setMains      = {setMains     }
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