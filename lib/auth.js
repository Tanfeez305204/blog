import CredentialsProvider from "next-auth/providers/credentials";
import { getSupabaseAdmin } from "./supabase";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const supabase = getSupabaseAdmin();
          const { data: user, error } = await supabase
            .from("users")
            .select("id, email, name, role, is_active")
            .eq("email", credentials.email.trim().toLowerCase())
            .eq("password", credentials.password)
            .eq("is_active", true)
            .single();

          if (error || !user) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.email = token.email;
      }
      return session;
    }
  }
};
