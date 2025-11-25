import NextAuth, { type NextAuthConfig } from "next-auth"
import Authentik from "next-auth/providers/authentik"

const config = {
    providers: [
        Authentik({
            clientId: process.env.AUTHENTIK_CLIENT_ID,
            clientSecret: process.env.AUTHENTIK_CLIENT_SECRET,
            issuer: process.env.AUTHENTIK_ISSUER,
        }),
    ],
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
