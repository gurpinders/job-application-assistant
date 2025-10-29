import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import axios from "axios"

type Credentials = {
  email: string
  password: string
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials: Partial<Credentials>){
                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null
                    }
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, 
                        {
                            email: credentials.email,
                            password: credentials.password
                        }
                    );
                    if(response.data.access_token){
                        return{
                            id: credentials.email,
                            email: credentials.email as string,
                            accessToken: response.data.access_token
                        }
                    }
                    return null;
                } catch {
                    return null;
                }
            }
        })
    ]
})

