//** REACT IMPORTS
import React, { useEffect, useState } from "react";

//** CUSTOM HOOKS
import useColumns from '../hooks/useColumns'
import useIsUserLoggedIn from "@/hooks/useIsLogguedIn";

//** NEXTJS IMPORTS
import { useRouter } from "next/router"

//** GRAPHQL/APOLLO IMPORTS
import { useQuery, useApolloClient } from "@apollo/client"
import { ME, GET_AIS, GET_TOPICS, GET_CARDS } from '@/queries'

//** TYPES

import { User, Topic, Card, AI, Mains, Visibility } from '../types'
import { meData, aiListData, aiListVariables, topicListData, topicListVariables, getCardsData, getCardsVariables } from "../types";

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

export default function Me() {

  const [mains,      setMains      ] = useState<Mains>({main: undefined, topic: undefined, currCard: undefined, profile: true});
  const [visibility, setVisibility ] = useState<Visibility>({showMenu:"none", showSS:true, showPS:false})
  
  //** STATE WHICH SETS CURRENT USER
  const { data: {me} = {} } = useQuery<meData>(ME)  

  //** STATES WICH CONTROLS ITEM LISTS
  const { data: { getAis: aiList } = {} } = useQuery<aiListData, aiListVariables>(GET_AIS, {
    variables: {meId: me?.id},
    skip: !me?.id,
  });

  const { data: {getTopics: topicList} = {} } = useQuery<topicListData, topicListVariables>(GET_TOPICS, {
    variables: { mainId: mains.main?.id },
    skip: !mains.main?.id
  });

  const { data: {getCards: cardList} = {} } = useQuery<getCardsData, getCardsVariables>(GET_CARDS, {
    variables: {topicId: mains.topic?.id},
    skip: !mains.topic?.id
  });

  //** HOOKS & CUSTOM HOOKS
  const router    = useRouter() 
  const columns   = useColumns(visibility)
  const client    = useApolloClient()
  const isLoggued = useIsUserLoggedIn()

  //** USE EFFECTS

  useEffect(()=> {
    if (!isLoggued) {
        router.push("/login")
    } 
  }, [isLoggued]) // eslint-disable-line

  const signOff = async()=> {
    sessionStorage.clear()
    router.push("/login")
    await client.resetStore()
    await client.cache.reset()
  }
  
  return (
    <div className={style.main}>
      {visibility.showMenu !== "none" && 
        <div className={style[`opt-mode`]}>
          {visibility.showMenu === "add ai"      &&  <AddAI     me={me}       setVisibility={setVisibility} setMains={setMains} />}
          {visibility.showMenu === "add prompt"  &&  <AddPrompt mains={mains} setVisibility={setVisibility} setMains={setMains} />}
          {visibility.showMenu === "add stack"   &&  <AddStack  mains={mains} setVisibility={setVisibility} setMains={setMains} />}
        </div>
      }

      {aiList === undefined && <div className={style.loading}></div>}

      <MainSidebar 
        mains         = {mains        }
        aiList        = {aiList       }   
        topicList     = {topicList    } 
        visibility    = {visibility   }
        setMains      = {setMains     } 
        setVisibility = {setVisibility}
      />
      <SecSidebar 
        key           = {mains.main?.id}
        me            = {me           } 
        mains         = {mains        } 
        aiList        = {aiList       } 
        topicList     = {topicList    }
        visibility    = {visibility   } 
        setMains      = {setMains     }
        setVisibility = {setVisibility} 
        signOff       = {signOff      }
      />
      <div className={style[`main-content`]} >
        <MainContentMenu mains={mains} />
        <MainContentGrid 
          key            = {mains.topic?.id}
          mains          = {mains          } 
          cardList       = {cardList       } 
          columns        = {columns        } 
          visibility     = {visibility     }
          setMains       = {setMains       }
          setVisibility  = {setVisibility  }
        />
      </div>
      <PromptSidebar 
        key           = {mains.currCard?.id} 
        mains         = {mains} 
        visibility    = {visibility} 
        setVisibility = {setVisibility} 
        setMains      = {setMains}
      />
    </div>
  )
}