import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (!adminEmail) return false;
  return email.trim().toLowerCase() === adminEmail;
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
      if (!isAdminEmail(user.email)) {
        return `/admin/login?error=AccessDenied`;
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
      if (user) token.email = user.email;
      return token;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
