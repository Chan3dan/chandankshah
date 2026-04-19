import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? "";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL);
      const userEmail = normalizeEmail(user.email);

      // Block any email that isn't the configured admin email.
      if (!userEmail || !adminEmail || userEmail !== adminEmail) {
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
