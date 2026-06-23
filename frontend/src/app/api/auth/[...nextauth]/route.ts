import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "EMIS Login",
      credentials: {
        loginType: { label: "Login Type", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        rollNumber: { label: "Roll Number", type: "text" },
        phone: { label: "Phone Number", type: "text" },
      },
      async authorize(credentials) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          const res = await fetch(`${apiUrl}/api/users/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              loginType: credentials?.loginType || "staff",
              email: credentials?.email,
              password: credentials?.password,
              rollNumber: credentials?.rollNumber,
              phone: credentials?.phone,
            }),
          });
          const result = await res.json();
          if (result.success && result.data) {
            return result.data;
          }
        } catch (err) {
          console.error("NextAuth authorize error:", err);
        }
        return null;
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
