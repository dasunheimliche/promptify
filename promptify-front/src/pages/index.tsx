import  { useState, useContext, useEffect} from "react"
import Link from "next/link"
import { AuthContext, useAuth } from "@/contexts/Authcontext"
import { useRouter } from "next/router"

const Home = ()=> {

  let tkn
  if (typeof window !== "undefined") {
    tkn = sessionStorage.getItem('user-token')
  }

  const [token]          = useState<string | undefined>(tkn? tkn : undefined)

  // const {token, setToken} = useAuth()

  const router = useRouter()

  if (token) {
    router.push("/me")
  }

  return (
      <div>
          <Link href={`/login`}>GO TO LOGIN</Link>
      </div>
  )
}

export default Home
