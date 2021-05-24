import { createContext, ReactNode, useState } from "react";
import { api } from "../services/api";
import Router from 'next/router'


type User = {
  email: string;
  permissions: string[];
  roles: string[];
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({children}: AuthProviderProps) {

  const [user, setUser] = useState<User>(null);


  const isAuthenticated = !!user;

  async function signIn({email, password}: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        password,
      })
      
      const { token, refreshToken, permissions, roles } = response.data;

      setUser({
        email,
        permissions,
        roles
      })

      Router.push('/dashboard');

    }

    catch (err){
      console.log(err)
    }

  }

  return (
    <AuthContext.Provider value={ {signIn, isAuthenticated, user} } >
      {children}
    </AuthContext.Provider>
  )
}