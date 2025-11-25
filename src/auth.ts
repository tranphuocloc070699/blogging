// lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { USER_ROLE } from "@/config/enums";
import userService from "@/services/modules/user-service";
import "@/lib/envConfig"

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.data.accessToken,
      refreshToken: refreshedTokens.data.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + (refreshedTokens.data.expiresIn || 3600) * 1000,
    };
  } catch (error) {
    console.error("RefreshAccessTokenError:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(3),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        try {
          const response = await userService.login({ email, password });

          const userData = response?.body?.data?.data;
          const accessToken = response?.body?.data?.accessToken;
          const refreshToken = response?.body?.data?.refreshToken;

          if (!userData || !accessToken || !refreshToken) return null;
          if (!userData.id || !userData.email || !userData.username || !userData.role) {
            return null;
          }

          return {
            id: String(userData.id),
            email: userData.email,
            name: userData.username,
            username: userData.username,
            role: userData.role as typeof USER_ROLE[keyof typeof USER_ROLE],
            accessToken,
            refreshToken,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      // First login
      if (user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + (parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRE || "3600") * 1000),
        };
      }

      // If access token still valid
      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Need to refresh
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.role = token.role as typeof USER_ROLE[keyof typeof USER_ROLE];
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.accessTokenExpires = token.accessTokenExpires as number;

      if (token.error) {
        session.error = token.error as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});