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
        let user = null;
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
          console.log("Invalid password");
          return null;
        }

        user = existingUser;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
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
    maxAge: 60 * 60 * 24 * 7,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }

      return session;
    },
  },
});
