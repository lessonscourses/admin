import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "~/server/models/User";

export default NuxtAuthHandler({
  secret: "uih8y8hiujbhiuhg8787t667r6f65r65d65d6d65d65d65d65d6",
  // secret: useRuntimeConfig().authSecret,

  pages: {
    signIn: "/login",
    signOut: "/",
  },

  providers: [
    CredentialsProvider.default({
      name: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const user = await User.findOne({ username: credentials.username });

        if (!user) {
          throw createError({
            statusCode: 401,
            statusMessage: "Unautorized",
          });
        }
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw createError({
            statusCode: 401,
            statusMessage: "Unautorized",
          });
        }

        return {
          ...user.toObject(),
          password: undefined,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token = {
          ...token,
          ...user,
        };
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...token,
        ...session.user,
      };
      return session;
    },
  },
});
