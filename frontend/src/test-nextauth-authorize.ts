import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// We extract and run the authorize function directly
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
          const apiUrl = "http://localhost:5000";
          console.log("Authorize called. NextAuth connecting to API URL:", apiUrl);
          
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
          console.log("Backend auth response status:", res.status, "Success:", result?.success);
          
          if (result.success && result.data) {
            return result.data;
          } else {
            console.log("Auth failed or user not returned by backend:", result?.error);
          }
        } catch (err) {
          console.error("NextAuth authorize error:", err);
        }
        return null;
      },
    }),
  ],
};

async function main() {
  const provider = authOptions.providers[0] as any;
  
  console.log('--- Testing Student Authorize ---');
  const studentUser = await provider.authorize({
    loginType: 'student',
    rollNumber: 'HM10103',
    phone: '9655258556'
  });
  console.log('Result for student authorize:', studentUser);

  console.log('\n--- Testing Headmaster Authorize ---');
  const hmUser = await provider.authorize({
    loginType: 'staff',
    email: 'headmaster@gmail.com',
    password: 'Headmaster@26'
  });
  console.log('Result for headmaster authorize:', hmUser);
}

main();
