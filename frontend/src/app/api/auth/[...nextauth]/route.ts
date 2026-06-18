import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "EMIS Login",
      credentials: {
        emisId: { label: "EMIS ID", type: "text", placeholder: "e.g. 33141..." },
        password: { label: "Password / OTP", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.emisId || !credentials?.password) return null;

        // Connect to our Node.js backend
        try {
          // For now, mock authentication for development
          if (credentials.emisId.length > 5 && credentials.password.length > 3) {
            return {
              id: "1",
              name: "Student Name",
              email: `${credentials.emisId}@tn.gov.in`,
              role: "STUDENT",
            };
          }
          return null;
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "tn-schools-ai-ecosystem-secret-2025",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
