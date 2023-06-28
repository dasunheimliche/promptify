// DEPENDENCIES

import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router"
import { INVALID_USERNAMES, CREATE_USER } from '@/queries'
import { useMutation, useQuery } from '@apollo/client'

import style from '../styles/register.module.css'

interface InvaludUsernameList {
    getInvalidUsernames: string[]
}

interface Inputs {
    name: string 
    lastname: string
    username: string
    email: string
    password: string
    password2: string
}

type isOk = undefined | false | true

const Register = ()=> {

    // STATES
    let [inputs,       setInputs     ] = useState<Inputs>({ name: "", lastname: "", username: "", email: "", password: '', password2: '' })
    let [validUsers,   setValidUsers ] = useState<string[] | undefined>([])

    let [isPassOk,     setIsPassOk   ] = useState<isOk>(undefined)
    let [isUsernameOk, setIsUserameOk] = useState<isOk>(undefined) 

    const { data, loading } = useQuery<InvaludUsernameList>(INVALID_USERNAMES)
    const [ createUser, {loading: CUloading}] = useMutation(CREATE_USER)

    const router = useRouter()

    useEffect(()=> {
        if (data) {
            setValidUsers(data.getInvalidUsernames)
        }
    }, [data])

    useEffect(()=> {
        if (inputs.password !== inputs.password2 || inputs.password.length < 1) {
            setIsPassOk(false)
        } else {
            setIsPassOk(true)
        }
    }, [inputs.password, inputs.password2])

    useEffect(()=> {
        if (!validUsers) return

        if (validUsers.includes(inputs.username)) {
            setIsUserameOk(false)
        } else {
            setIsUserameOk(true)
        }

    }, [inputs.username, validUsers])

    // EVENT HANDLERS
    let signin = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            await createUser({
                variables: {
                name: inputs.name,
                lastname: inputs.lastname,
                username: inputs.username,
                email: inputs.email,
                password: inputs.password,
                },
            });
            router.push('/login');
        } catch (error) {
            console.error('An error occurred while signing up:', error);
        }
    };

    return (
        <div className={style.main}>

            <div className={style['left-side']}>

                <div className={style.card}>

                    <div>Bienvenido a Promptify</div>
                    <div>Por favor ingrese sus datos</div>
                    <form className={style.form} onSubmit={isPassOk && isUsernameOk? signin : undefined}>

                        <input required  type='text' onChange={(e)=> setInputs({...inputs, name: e.target.value})}     placeholder={'name'} />
                        <input required  type='text' onChange={(e)=> setInputs({...inputs, lastname: e.target.value})} placeholder={'lastname'} />
                        <input required  type='text' onChange={(e)=> setInputs({...inputs, username: e.target.value})} placeholder={'username'} />
                        <div className={!isUsernameOk? style.invalidUser : undefined}></div>

                        <input required  type='email'    onChange={(e)=> setInputs({...inputs, email: e.target.value})}     placeholder={'e-mail'} />
                        <input required  type='password' onChange={(e)=> setInputs({...inputs, password: e.target.value})}  placeholder={'password'} />
                        <input required  type='password' onChange={(e)=> setInputs({...inputs, password2: e.target.value})} placeholder={'repeat password'} />
                        <div className={inputs.password? (inputs.password !== inputs.password2? style.notPass: (inputs.password.length < 5? style.tooShort : '')) : ''}></div>

                        <button type='submit' className="p">Sign in</button>

                    </form>

                </div>

            </div>

            <div className={style['right-side']}>
                
            </div>
        </div>
    )
}

export default Register