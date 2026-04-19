import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Block any email that isn't the admin
      if (!user.email || user.email !== process.env.ADMIN_EMAIL) {
        return false; // NextAuth will redirect to /admin/login?error=AccessDenied
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",  // errors go to login page with ?error= param
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true, // Required for some deployment scenarios
});
