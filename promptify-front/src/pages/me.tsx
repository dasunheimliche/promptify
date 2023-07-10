//** REACT IMPORTS
import React, { useEffect, useState } from "react";

//** CUSTOM HOOKS
import useIsUserLoggedIn from "@/hooks/useIsLogguedIn";

//** NEXTJS IMPORTS
import { useRouter } from "next/router"

//** GRAPHQL/APOLLO IMPORTS
import { useQuery } from "@apollo/client"
import { ME, GET_AIS } from '@/queries'

//** TYPES

import { Mains, Visibility } from '../types'
import { meData, aiListData, aiListVariables } from "../types";

//** COMPONENTES
import MainSidebar     from "@/components/MainSidebar";
import SecSidebar      from "@/components/SecSidebar";
import MainContentMenu from "@/components/MainContentMenu";
import MainContentGrid from "@/components/MainContentGrid";
import PromptSidebar   from "@/components/PromptSidebar";
import AddAI           from "@/components/AddAI";
import AddPrompt       from "@/components/AddPrompt";
import AddStack        from "@/components/AddStack";

//** STYLES
import style from '../styles/me.module.css'

export default function Me() {

  const [mains,      setMains      ] = useState<Mains>({main: undefined, topic: undefined, currCard: undefined, profile: true});
  const [visibility, setVisibility ] = useState<Visibility>({showMenu:"none", showSS:true, showPS:false})

  const router    = useRouter() 
  const isLoggued = useIsUserLoggedIn()
  
  const { data: {me} = {} } = useQuery<meData>(ME)  

  const { data: { getAis: aiList } = {} } = useQuery<aiListData, aiListVariables>(GET_AIS, {
    variables: {meId: me?.id},
    skip: !me?.id,
  });


  //** USE EFFECTS

  useEffect(()=> {
    if (!isLoggued) {
        router.push("/login")
    } 
  }, [isLoggued]) // eslint-disable-line
  
  return (
    <div className={style.main}>
      {visibility.showMenu !== "none" && 
        <div className={style[`opt-mode`]}>
          {visibility.showMenu === "add ai"      &&  <AddAI     me={me}       setVisibility={setVisibility} setMains={setMains} />}
          {visibility.showMenu === "add prompt"  &&  <AddPrompt mains={mains} setVisibility={setVisibility} />}
          {visibility.showMenu === "add stack"   &&  <AddStack  mains={mains} setVisibility={setVisibility} />}
        </div>
      }

      {aiList === undefined && <div className={style.loading}></div>}

      <MainSidebar 
        mains         = {mains        }
        aiList        = {aiList       }   
        visibility    = {visibility   }
        setMains      = {setMains     } 
        setVisibility = {setVisibility}
      />
      <SecSidebar 
        key           = {mains.main?.id}
        me            = {me           } 
        mains         = {mains        } 
        aiList        = {aiList       } 
        visibility    = {visibility   } 
        setMains      = {setMains     }
        setVisibility = {setVisibility} 
      />
      <div className={style[`main-content`]} >
        <MainContentMenu mains={mains} />
        <MainContentGrid 
          key            = {mains.topic?.id}
          mains          = {mains          } 
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