import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { FormEvent, useContext, useState } from "react"

import { AuthContext } from '../contexts/AuthContext';


export default function Home() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const { signIn, } = useContext(AuthContext)

  async function handleSubmit(e: FormEvent) {

    e.preventDefault();

    const data = {
      email, 
      password,
    }

    await signIn(data)
  }

  return (
    <form onSubmit={handleSubmit}  >
      <input type="email"  value={email}  onChange={(e) => setEmail(e.target.value) } />
      <input type="password"  value={password}  onChange={(e) => setPassword(e.target.value) } />
      <button type="submit">Entrar</button>
    </form>
  )
}


export const getServerSideProps: GetServerSideProps = async(ctx) => {

  const cookies = parseCookies(ctx);
  
  if (cookies['nextauth.token']) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}


function AuthContextData(AuthContextData: any): {} {
  throw new Error("Function not implemented.");
}

