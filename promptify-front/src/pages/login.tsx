
import { useState, useEffect } from 'react'
import { useAuth } from "@/contexts/Authcontext"
import { useRouter } from "next/router"
import { useMutation } from "@apollo/client"

import { LOGIN } from '@/queries'
import { Token } from '../types'

interface loginData {
    login: Token
}

interface loginVariables {
    username: string
    password: string
}

const Login = ()=> {

    //  STATES
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>("")

    // CUSTOM STATES
    const {token, setToken} = useAuth()
    const router = useRouter()

    // USE MUTATION
    const [ login, {error: mutationError, data} ] = useMutation<loginData, loginVariables>(LOGIN, {
        onError: (error) => {
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                setError(error.graphQLErrors[0].message)
            } else {
                setError("An unknown error occurred.")
            }
        }
    })

    // USE EFFECTS
    useEffect(()=> {
        if (token) {
            router.push("/me")
        } 
    }, [token]) // eslint-disable-line

    useEffect(() => {
        if ( data ) {
            const token = data.login.value
            setToken(token)
            sessionStorage.setItem('user-token', token)
        }
    }, [data]) // eslint-disable-line

    // EVENT HANDLERS
    const submit = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        login({ variables: { username, password } })
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>{error}</div>
                <label htmlFor="">User</label>
                <input type="text" placeholder="User" onChange={(e)=>setUsername(e.target.value)}/>
                <label htmlFor="">Password</label>
                <input type="password" placeholder="password" onChange={e=>setPassword(e.target.value)} />
                <button type="submit">SEND</button>
            </form>
        </div>
    )
}

export default Login