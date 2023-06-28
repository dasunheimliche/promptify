import  { useState} from "react"
import { useRouter } from "next/router"
import { getUserToken } from "@/utils/functions"
import Link from "next/link"

const Home = ()=> {
  const [token] = useState<string | null>(getUserToken()? getUserToken() : null)

  const router = useRouter()

  //**  TEMPORAL CODE UNTIL LANDPAGE WRITEN
  if (typeof window !== 'undefined') {
    if (token !== null) {
      router.push('/me')
    } else {
      router.push('/login')
    }
  }

  return (
      <div>
          {/* <Link href={`/login`}>GO TO LOGIN</Link> */}
      </div>
  )
}

export default Home
