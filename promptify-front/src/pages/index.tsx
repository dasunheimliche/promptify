import { useEffect, useState } from "react";

import MainSidebar from "@/components/MainSidebar";
import SecSidebar from "@/components/SecSidebar";
import PromptSidebar from "@/components/PromptSidebar";

import MainContentMenu from "@/components/MainContentMenu";
import MainContentGrid from "@/components/MainContentGrid";

import AddAI from "@/components/AddAI";
import AddPrompt from "@/components/AddPrompt";
import AddStack from "@/components/AddStack";

import { User, Card } from '../types'



let me: User = {
    "username": "Claussimar",
    "userID": "13456548794654",
    "allPrompts": [
      {
        "name": "Chat GPT",
        "abb": "C-GPT",
        "topics": [
          {
            "name": "General",
            "cards": [
              {
                "title": "Convertir texto a flashcards",
                "prompts": [
                  {"id": 1, "title": "Convertir texto a preguntas", "content": "Turn the next text into a series of questions. Don't answer them for now. \n\n"},
                  {"id": 2, "title": "Responder las preguntas creadas", "content": "Answer all this questions and PLEASE don't forget adding typescript code for better understanding on each answer:\n\n\n\n\n\nPLEASE don't forget adding typescript code for better understanding on each answer:"}
                ]
              }
            ]
          },
          {
            "name": "Programming",
            "cards": [
              {
                "title": "Convertir texto a flashcards",
                "prompts": [
                  {"id": 1, "title": "Convertir texto a preguntas", "content": "Convert the next text in a series of questions. Don't answer them for now. \n"},
                  {"id": 2, "title": "Responder las preguntas creadas", "content": "Answer all this questions and PLEASE don't forget adding typescript code for better understanding on each answer:\n\n\n\n\n\nPLEASE don't forget adding typescript code for better understanding on each answer:"}
                ],
              }
            ]
          },
        ]
      },
    ]
}

export default function Home() {
  const [user, setUser] = useState<User>(me)
  const [main, setMain] = useState<string>("none")
  const [topic, setTopic] = useState<string>("none")

  const [showMenu, setShowMenu] = useState<string>("none")
  const [showSS, setShowSS] = useState<boolean>(true)
  const [showPS, setShowPS] = useState<boolean>(false)

  const [currCard, setCurrentCard] = useState<Card | undefined>()

  const [columns, setColumns] = useState<number>(3)

  console.log("COLUMNS", columns)
  console.log("SS AND SP", showSS, "  ", showPS)

  useEffect(()=> {
    if (showPS === true && showSS === true) {
      setColumns(2)
    } else {
      setColumns(3)
    }
  }, [showPS, showSS])

  return (
    <div className='main'>
      {showMenu !== "none" && <div className="opt-mode">
        {showMenu === "add ai" && <AddAI user={user} setUser={setUser} setShowMenu={setShowMenu}/>}
        {showMenu === "add prompt" && <AddPrompt user={user} main={main} topic={topic} setUser={setUser} setShowMenu={setShowMenu}/>}
        {showMenu === "add stack" && <AddStack user={user} main={main} topic={topic} setUser={setUser} setShowMenu={setShowMenu}/>}

      </div>}
      

      <MainSidebar user={user} main={main} showSS={showSS} setMain={setMain} setShowMenu={setShowMenu} setShowSS={setShowSS}/>
      <SecSidebar user={user} main={main} showSS={showSS} setUser={setUser} setTopic={setTopic} setShowSS={setShowSS} setShowPS={setShowPS}/>
      <div className="main-content">
        <MainContentMenu topic={topic} />
        <MainContentGrid user={user} setUser={setUser} main={main} columns={columns} topic={topic} setShowMenu={setShowMenu} setCurrentCard={setCurrentCard} setShowPS={setShowPS}/>
      </div>
      {(currCard !== undefined && showPS == true) && <PromptSidebar currCard={currCard} showPS={showPS} setShowPS={setShowPS}/>}
    </div>
  )
}
