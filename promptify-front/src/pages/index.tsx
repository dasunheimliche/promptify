import  { useState} from "react"
import Link from "next/link"
import { useRouter } from "next/router"

const Home = ()=> {

  let tkn
  if (typeof window !== "undefined") {
    tkn = sessionStorage.getItem('user-token')
  }

  const [token] = useState<string | undefined>(tkn? tkn : undefined)

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
