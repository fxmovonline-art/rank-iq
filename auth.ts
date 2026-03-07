import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.email || !credentials?.password) {
          console.warn("Missing credentials");
          return null;
        }

        try {
          // Find user by email
          const user = await db.user.findUnique({
            where: { email: credentials.email as string }
          });

          // Check if user exists and has a password hash
          if (!user || !user.passwordHash) {
            console.warn(`Login attempt for non-existent user: ${credentials.email}`);
            return null;
          }

          // Verify password
          const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!passwordsMatch) {
            console.warn(`Invalid password attempt for: ${credentials.email}`);
            return null;
          }

          // Return user object for successful authentication
          return {
            id: user.id,
            email: user.email,
            name: user.email.split("@")[0], // Use email prefix as name
          };
        } catch (error: any) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
})
