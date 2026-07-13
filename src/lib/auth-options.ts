import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "manager@storeandshare.in" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password.");
        }

        // Check if database URL is set
        if (!process.env.DATABASE_URL) {
          throw new Error("Neon Database is not connected. Please set up DATABASE_URL first.");
        }

        try {
          // Fetch user
          const user = await db.user.findUnique({
            where: { email: credentials.email.toLowerCase().trim() },
          });

          if (!user) {
            throw new Error("Invalid email or password.");
          }

          // Compare password
          const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword);

          if (!isValidPassword) {
            throw new Error("Invalid email or password.");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            societyId: user.societyId,
          };
        } catch (error: any) {
          console.error("Authentication helper error:", error);
          if (error.message && error.message.includes("Invalid")) {
            throw error;
          }
          throw new Error("Database could not be reached. Ensure migrations are applied.");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.societyId = user.societyId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.societyId = token.societyId;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
