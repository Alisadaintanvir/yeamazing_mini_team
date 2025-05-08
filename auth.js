import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { comparePassword } from "./lib/auth";
import { prisma } from "./lib/prisma";

const providers = [
  Credentials({
    credentials: {
      email: {},
      password: {},
    },
    authorize: async (credentials) => {
      try {
        const { email, password } = credentials;

        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!existingUser) {
          return null;
        }

        const isPasswordValid = await comparePassword(
          password,
          existingUser.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = existingUser;
        return userWithoutPassword;
      } catch (error) {
        throw new Error("An error occurred during authentication");
      }
    },
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Add user data to the token
        token.id = user.id;
        token.role = user.role;
        token.permissions = user?.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Add token data to the session
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.permissions = token.permissions;
      }
      return session;
    },
  },
});
