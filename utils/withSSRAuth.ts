import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";


export function withSSRAuth<p>(fn: GetServerSideProps<p>) {
  
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<p>> => {
    const cookies = parseCookies(ctx);
  
    if (!cookies['nextauth.token']) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    }
    
    try {
      return await fn(ctx)
    } catch(errors) {
      if (errors instanceof AuthTokenError) {
          
        destroyCookie(ctx, 'nextauth.token');
        destroyCookie(ctx, 'nextauth.refreshToken');
    
        return { 
          redirect: {
            destination: '/',
            permanent: false,
          }
        }
      }
    }
  }

}