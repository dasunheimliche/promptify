import { useState, useEffect } from 'react';
import { getUserToken } from '@/utils/functions';

function useIsUserLoggedIn() {
    const [token, setToken] = useState<string  | null>(getUserToken()? getUserToken() : null)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(token? true: false);


  useEffect(()=> {
    const token: string | null = sessionStorage.getItem('user-token')
    if (token === null) {
        setIsLoggedIn(false)
      return
    }
    setIsLoggedIn(true)
    setToken(token)
    
  }, []) 

  return isLoggedIn;
}

export default useIsUserLoggedIn