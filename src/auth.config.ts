import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isOnAdmin) {
        // Simple check for now, can be more robust with role check here too
        if (isLoggedIn && auth.user.role === "ADMIN") return true;
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl)); // Redirect non-admins
        return false;
      } else if (isLoggedIn) {
        // Redirect logged-in users away from auth pages
        // if (nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup")) {
        //   return Response.redirect(new URL("/dashboard", nextUrl));
        // }
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as "CLIENT" | "FREELANCER" | "ADMIN";
      }
      if (token.bio && session.user) {
        session.user.bio = token.bio as string;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.bio = user.bio;
      }
      // Support updating session client-side
      if (trigger === "update" && session?.user) {
        token.role = session.user.role;
        // Allow updating bio via session update
        if (session.user.bio) token.bio = session.user.bio;
      }
      return token;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
