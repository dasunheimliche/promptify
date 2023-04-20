
import { useState, useEffect } from 'react'
// import { useAuth } from "@/contexts/Authcontext"
import { useRouter } from "next/router"
import Link from 'next/link'
import { useMutation } from "@apollo/client"


import { LOGIN } from '@/queries'
import { Token } from '../types'

import style from '../styles/auth.module.css'

interface loginData {
    login: Token
}

interface loginVariables {
    username: string
    password: string
}

const Login = ()=> {
    let tkn
    if (typeof window !== "undefined") {
      tkn = sessionStorage.getItem('user-token')
    }

    const [token, setToken]          = useState<string | undefined>(tkn? tkn : undefined)

    //  STATES
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    let [ok, setOk] = useState<boolean>(true)

    // CUSTOM STATES
    const router = useRouter()

    // USE MUTATION
    const [ login, {error: mutationError, data} ] = useMutation<loginData, loginVariables>(LOGIN, {
        onError: (error) => {
            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                setOk(false)
                console.error(error.graphQLErrors[0].message)
            } else {
                setOk(false)
                console.error("An unknown error occurred.")
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

    const demoSubmit = async(event:React.MouseEvent<HTMLButtonElement, MouseEvent>)=> {
        event.preventDefault()
        await login({ variables: { username: "Horrorshow", password: "12345" } })
    }

    return (
        <div className={style.main}>

            <div className={style['left-side']}>

                <div className={style.card}>

                    <div>Bienvenido/a</div>
                    <div>Por favor ingrese sus datos</div>

                    <form className={style.form} onSubmit={submit}>

                        <input required type='text'     onChange={(e)=> setUsername(e.target.value)} placeholder={'username'} />
                        <input required type='password' onChange={(e)=> setPassword(e.target.value)} placeholder={'password'} />
                        {!ok && <div className={style.failedLogin}></div>}
                        <button type='submit' className="p" >Log in</button>
                        <button type='button' className="p" onClick={demoSubmit}>Demo</button>

                    </form>

                    <div className={style.toRegister}>
                        <p >¿No tienes una cuenta?</p>
                        <Link href={'/register'}>Regístrate gratis</Link>
                    </div>

                </div>

            </div>

            <div className={style['right-side']}>


            </div>

        </div>
    )
}

export default Login