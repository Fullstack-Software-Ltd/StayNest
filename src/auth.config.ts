import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [], // Providers are added in auth.ts to avoid edge issues with prisma/bcrypt
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') || 
                            nextUrl.pathname.startsWith('/admin') || 
                            nextUrl.pathname.startsWith('/owner') ||
                            nextUrl.pathname.startsWith('/host')
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect to login
      }
      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string
        token.role = (user as any).role || 'guest'
        token.isHostOnboarded = (user as any).isHostOnboarded || false
      }

      // Handle manual session updates (e.g. after onboarding)
      if (trigger === 'update' && session) {
        if (session.role) token.role = session.role
        if (session.isHostOnboarded !== undefined) token.isHostOnboarded = session.isHostOnboarded
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        (session.user as any).role = token.role as string
        (session.user as any).isHostOnboarded = token.isHostOnboarded as boolean
      }
      return session
    },
  },
} satisfies NextAuthConfig
