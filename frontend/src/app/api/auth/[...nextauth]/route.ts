import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "EMIS Login",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "student@gmail.com" },
        password: { label: "Password", type: "password" },
        emisId: { label: "EMIS ID", type: "text", placeholder: "e.g. 33141..." },
      },
      async authorize(credentials) {
        const password = credentials?.password || "";
        if (password !== "123456" && password.length < 4) return null;

        const email = credentials?.email || "";
        const emisId = credentials?.emisId || "";

        if (email) {
          const lowerEmail = email.toLowerCase();
          if (lowerEmail === "student@gmail.com") {
            return { id: "student-1", name: "Arjun Kumar", email: "student@gmail.com", role: "STUDENT" };
          }
          if (lowerEmail === "teacher@gmail.com") {
            return { id: "teacher-1", name: "Sumathi Devi", email: "teacher@gmail.com", role: "TEACHER" };
          }
          if (lowerEmail === "parent@gmail.com") {
            return { id: "parent-1", name: "Rajesh Kumar", email: "parent@gmail.com", role: "PARENT" };
          }
          if (lowerEmail === "headmaster@gmail.com") {
            return { id: "headmaster-1", name: "Venkatesh R.", email: "headmaster@gmail.com", role: "HEADMASTER" };
          }
          if (lowerEmail === "beo@gmail.com") {
            return { id: "beo-1", name: "Murugesan P.", email: "beo@gmail.com", role: "BEO" };
          }
          if (lowerEmail === "deo@gmail.com") {
            return { id: "deo-1", name: "DEO Officer", email: "deo@gmail.com", role: "DEO" };
          }
          if (lowerEmail === "commissioner@gmail.com") {
            return { id: "commissioner-1", name: "Commissioner", email: "commissioner@gmail.com", role: "COMMISSIONER" };
          }
          if (lowerEmail === "minister@gmail.com") {
            return { id: "minister-1", name: "Minister Dashboard", email: "minister@gmail.com", role: "MINISTER" };
          }
        }

        // Fallback to EMIS ID
        if (emisId && password) {
          return {
            id: "emis-1",
            name: "Student Name",
            email: `${emisId}@tn.gov.in`,
            role: "STUDENT",
          };
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
