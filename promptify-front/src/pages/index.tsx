import { useEffect, useState } from "react";

import MainSidebar from "@/components/MainSidebar";
import SecSidebar from "@/components/SecSidebar";
import PromptSidebar from "@/components/PromptSidebar";

import MainContentMenu from "@/components/MainContentMenu";
import MainContentGrid from "@/components/MainContentGrid";

import AddAI from "@/components/AddAI";
import AddPrompt from "@/components/AddPrompt";


import { User, Prompt } from '../types'

let me: User = {
    "username": "Claussimar",
    "userID": "13456548794654",
    "allPrompts": [
      {
        "name": "Midjourney",
        "abb": "MJ",
        "sections": [
          {
            "name": "General",
            "prompts": [
              { id: 1, title: "Convertir texto a preguntas", content: "Convert the next text in a series of questions. Don't answer them for now. \n" },
              { id: 2, title: "asdf", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur molestie elementum gravida. Vivamus in sapien iaculis, varius elit eget, blandit sapien. Maecenas vel lacus venenatis, rutrum urna id, imperdiet quam. Vestibulum in mi imperdiet, malesuada lectus suscipit, commodo ipsum. Morbi nec magna nibh. Donec rhoncus velit a gravida dictum. Ut id est elit. Etiam elementum pellentesque ornare. Mauris pharetra luctus augue. Duis rutrum, ante id pellentesque sodales, enim lectus sollicitudin risus, at fermentum nulla justo id odio. Ut mi libero, iaculis et consequat placerat, ultricies quis leo. Etiam sed mi in est imperdiet scelerisque sed ac ipsum. Nunc id tellus ante. Aenean ut ex eget velit pretium vulputate aliquam a turpis. Sed eget felis ultricies, efficitur elit sed, tempus dui.' },
              { id: 3, title: "asdf", content: 'Pellentesque viverra laoreet nibh quis feugiat. Suspendisse sit amet consequat dolor. Duis tincidunt purus eu tortor tempus, at elementum urna viverra. Sed mattis felis mollis, tempor urna nec, suscipit lacus.' },
              { id: 4, title: "asdf", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
              { id: 5, title: "asdf", content: 'High Five' },
              { id: 6, title: "asdf", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet urna magna, quis euismod dolor cursus blandit. Sed et fringilla urna. Donec feugiat fermentum nisi a semper. Vestibulum quis mollis quam. Ut efficitur leo massa, ac finibus justo auctor ut. Aliquam a felis in dui congue scelerisque mollis vitae' },
              { id: 7, title: "asdf", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur molestie elementum gravida. Vivamus in sapien iaculis, varius elit eget, blandit sapien. Maecenas vel lacus venenatis, rutrum urna id, imperdiet quam. Vestibulum in mi imperdiet, malesuada lectus suscipit, commodo ipsum. Morbi nec magna nibh. Donec rhoncus velit a gravida dictum. Ut id est elit. Etiam elementum pellentesque ornare. Mauris pharetra luctus augue. Duis rutrum, ante id pellentesque sodales, enim lectus sollicitudin risus, at fermentum nulla justo id odio. Ut mi libero, iaculis et consequat placerat, ultricies quis leo. Etiam sed mi in est imperdiet scelerisque sed ac ipsum. Nunc id tellus ante. Aenean ut ex eget velit pretium vulputate aliquam a turpis. Sed eget felis ultricies, efficitur elit sed, tempus dui.' },
              { id: 8, title: "asdf", content: 'Pellentesque viverra laoreet nibh quis feugiat. Suspendisse sit amet consequat dolor. Duis tincidunt purus eu tortor tempus, at elementum urna viverra. Sed mattis felis mollis, tempor urna nec, suscipit lacus.' },
              { id: 9, title: "asdf", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
              { id: 10, title: "asdf", content: 'High Five' }
            ]
          },
          {
            "name": "Programming",
            "prompts": [
              { id: 1, title: "asdf", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet urna magna, quis euismod dolor cursus blandit. Sed et fringilla urna. Donec feugiat fermentum nisi a semper. Vestibulum quis mollis quam. Ut efficitur leo massa, ac finibus justo auctor ut. Aliquam a felis in dui congue scelerisque mollis vitae' },
              { id: 2, title: "asdf", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur molestie elementum gravida. Vivamus in sapien iaculis, varius elit eget, blandit sapien. Maecenas vel lacus venenatis, rutrum urna id, imperdiet quam. Vestibulum in mi imperdiet, malesuada lectus suscipit, commodo ipsum. Morbi nec magna nibh. Donec rhoncus velit a gravida dictum. Ut id est elit. Etiam elementum pellentesque ornare. Mauris pharetra luctus augue. Duis rutrum, ante id pellentesque sodales, enim lectus sollicitudin risus, at fermentum nulla justo id odio. Ut mi libero, iaculis et consequat placerat, ultricies quis leo. Etiam sed mi in est imperdiet scelerisque sed ac ipsum. Nunc id tellus ante. Aenean ut ex eget velit pretium vulputate aliquam a turpis. Sed eget felis ultricies, efficitur elit sed, tempus dui.' },
              { id: 3, title: "asdf", content: 'Pellentesque viverra laoreet nibh quis feugiat. Suspendisse sit amet consequat dolor. Duis tincidunt purus eu tortor tempus, at elementum urna viverra. Sed mattis felis mollis, tempor urna nec, suscipit lacus.' },
              { id: 4, title: "asdf", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
              { id: 5, title: "asdf", content: 'High Five' },
              { id: 6, title: "asdf", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet urna magna, quis euismod dolor cursus blandit. Sed et fringilla urna. Donec feugiat fermentum nisi a semper. Vestibulum quis mollis quam. Ut efficitur leo massa, ac finibus justo auctor ut. Aliquam a felis in dui congue scelerisque mollis vitae' },
              { id: 7, title: "asdf", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur molestie elementum gravida. Vivamus in sapien iaculis, varius elit eget, blandit sapien. Maecenas vel lacus venenatis, rutrum urna id, imperdiet quam. Vestibulum in mi imperdiet, malesuada lectus suscipit, commodo ipsum. Morbi nec magna nibh. Donec rhoncus velit a gravida dictum. Ut id est elit. Etiam elementum pellentesque ornare. Mauris pharetra luctus augue. Duis rutrum, ante id pellentesque sodales, enim lectus sollicitudin risus, at fermentum nulla justo id odio. Ut mi libero, iaculis et consequat placerat, ultricies quis leo. Etiam sed mi in est imperdiet scelerisque sed ac ipsum. Nunc id tellus ante. Aenean ut ex eget velit pretium vulputate aliquam a turpis. Sed eget felis ultricies, efficitur elit sed, tempus dui.' },
              { id: 8, title: "asdf", content: 'Pellentesque viverra laoreet nibh quis feugiat. Suspendisse sit amet consequat dolor. Duis tincidunt purus eu tortor tempus, at elementum urna viverra. Sed mattis felis mollis, tempor urna nec, suscipit lacus.' },
              { id: 9, title: "asdf", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
            ]
          },
          {
            "name": "History",
            "prompts": []
          }
        ]
      },
      {
        "name": "Chat GPT",
        "abb": "C-GPT",
        "sections": [
          {
            "name": "General",
            "prompts": [
              { id: 1, title: "Convertir texto a preguntas", content: "Convert the next text in a series of questions. Don't answer them for now.\n\n" },
              { id: 2, title: "Responde las preguntas", content: "Answer all this questions and PLEASE don't forget adding typescript code for better understanding on each answer:\n\n\n\n\n\nPLEASE don't forget adding typescript code for better understanding on each answer:" },
              { id: 3, title: "asdf", content: 'High Five' },
              { id: 4, title: "asdf", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet urna magna, quis euismod dolor cursus blandit. Sed et fringilla urna. Donec feugiat fermentum nisi a semper. Vestibulum quis mollis quam. Ut efficitur leo massa, ac finibus justo auctor ut. Aliquam a felis in dui congue scelerisque mollis vitae' },
              { id: 5, title: "asdf", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur molestie elementum gravida. Vivamus in sapien iaculis, varius elit eget, blandit sapien. Maecenas vel lacus venenatis, rutrum urna id, imperdiet quam. Vestibulum in mi imperdiet, malesuada lectus suscipit, commodo ipsum. Morbi nec magna nibh. Donec rhoncus velit a gravida dictum. Ut id est elit. Etiam elementum pellentesque ornare. Mauris pharetra luctus augue. Duis rutrum, ante id pellentesque sodales, enim lectus sollicitudin risus, at fermentum nulla justo id odio. Ut mi libero, iaculis et consequat placerat, ultricies quis leo. Etiam sed mi in est imperdiet scelerisque sed ac ipsum. Nunc id tellus ante. Aenean ut ex eget velit pretium vulputate aliquam a turpis. Sed eget felis ultricies, efficitur elit sed, tempus dui.' },
              { id: 6, title: "asdf", content: 'Pellentesque viverra laoreet nibh quis feugiat. Suspendisse sit amet consequat dolor. Duis tincidunt purus eu tortor tempus, at elementum urna viverra. Sed mattis felis mollis, tempor urna nec, suscipit lacus.' },
              { id: 7, title: "asdf", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
              { id: 8, title: "asdf", content: 'High Five' }
            ]
          },
          {
            "name": "Programming",
            "prompts": [
              { id: 1, title: "asdf", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet urna magna, quis euismod dolor cursus blandit. Sed et fringilla urna. Donec feugiat fermentum nisi a semper. Vestibulum quis mollis quam. Ut efficitur leo massa, ac finibus justo auctor ut. Aliquam a felis in dui congue scelerisque mollis vitae' },
              { id: 2, title: "asdf", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur molestie elementum gravida. Vivamus in sapien iaculis, varius elit eget, blandit sapien. Maecenas vel lacus venenatis, rutrum urna id, imperdiet quam. Vestibulum in mi imperdiet, malesuada lectus suscipit, commodo ipsum. Morbi nec magna nibh. Donec rhoncus velit a gravida dictum. Ut id est elit. Etiam elementum pellentesque ornare. Mauris pharetra luctus augue. Duis rutrum, ante id pellentesque sodales, enim lectus sollicitudin risus, at fermentum nulla justo id odio. Ut mi libero, iaculis et consequat placerat, ultricies quis leo. Etiam sed mi in est imperdiet scelerisque sed ac ipsum. Nunc id tellus ante. Aenean ut ex eget velit pretium vulputate aliquam a turpis. Sed eget felis ultricies, efficitur elit sed, tempus dui.' },
              { id: 3, title: "asdf", content: 'Pellentesque viverra laoreet nibh quis feugiat. Suspendisse sit amet consequat dolor. Duis tincidunt purus eu tortor tempus, at elementum urna viverra. Sed mattis felis mollis, tempor urna nec, suscipit lacus.' },
              { id: 4, title: "asdf", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
              { id: 5, title: "asdf", content: 'High Five' },
            ]
          }
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

  const [currPrompt, setCurrentPromt] = useState<Prompt| undefined>()

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
      </div>}
      

      <MainSidebar user={user} main={main} showSS={showSS} setMain={setMain} setShowMenu={setShowMenu} setShowSS={setShowSS}/>
      <SecSidebar user={user} main={main} showSS={showSS} setUser={setUser} setTopic={setTopic} setShowSS={setShowSS} setShowPS={setShowPS}/>
      <div className="main-content">
        <MainContentMenu topic={topic} />
        <MainContentGrid user={user} setUser={setUser} main={main} columns={columns} topic={topic} setShowMenu={setShowMenu} setCurrentPromt={setCurrentPromt} setShowPS={setShowPS}/>
      </div>
      {(currPrompt !== undefined && showPS == true) && <PromptSidebar currPrompt={currPrompt} showPS={showPS} setShowPS={setShowPS}/>}
    </div>
  )
}
