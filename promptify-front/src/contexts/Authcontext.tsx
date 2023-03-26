import { createContext, useContext, useState, Dispatch } from 'react';

export type AuthContextType = {
  token: string | undefined;
  setToken: Dispatch<string | undefined>;
};

export const AuthContext = createContext<AuthContextType>({
  token: undefined,
  setToken: () => {},
});

type AuthProviderProps = {
  children: React.ReactNode;
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children } : AuthProviderProps) => {
  const [token, setToken] = useState<string | undefined>(undefined);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};