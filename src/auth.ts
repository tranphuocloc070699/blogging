// lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Email from "next-auth/providers/nodemailer";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { USER_ROLE } from "@/config/enums";
import userService from "@/services/modules/user-service";
import { buildMagicLinkEmail } from "@/lib/email-templates";
import { createTransport } from "nodemailer";
import "@/lib/envConfig";

const prisma = new PrismaClient();

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      },
    );

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.data.accessToken,
      refreshToken: refreshedTokens.data.refreshToken ?? token.refreshToken,
      accessTokenExpires:
        Date.now() + (refreshedTokens.data.expiresIn || 3600) * 1000,
    };
  } catch (error) {
    console.error("RefreshAccessTokenError:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

const adapter = PrismaAdapter(prisma);

const customAdapter = {
  ...adapter,
  createUser: async (data: any) => {
    const email = data.email ?? "";

    // If user with this email already exists (e.g. registered via credentials),
    // return the existing user so NextAuth links the new provider to it.
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return existing as any;

    const username = email.split("@")[0] || `user_${Date.now().toString(36)}`;

    // Strip fields not in our schema (e.g. `name`, `image` from Google)
    const { name, image, ...rest } = data;
    return (adapter.createUser as Function)({
      ...rest,
      username,
      password: "",
    });
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: customAdapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Email({
      server: {
        host: process.env.SMTP_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: process.env.SMTP_ADMIN_EMAIL,
      async sendVerificationRequest({ identifier, url, provider }) {
        const { host } = new URL(url);
        const emailData = buildMagicLinkEmail({ email: identifier, url, host });
        const transport = createTransport(provider.server as any);
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
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
          if (
            !userData.id ||
            !userData.email ||
            !userData.username ||
            !userData.role
          ) {
            return null;
          }

          return {
            id: String(userData.id),
            email: userData.email,
            name: userData.username,
            username: userData.username,
            role: userData.role as (typeof USER_ROLE)[keyof typeof USER_ROLE],
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
    async signIn({ user, account }) {
      if (account?.provider === "credentials") return true;

      // For OAuth/magic-link providers, auto-link to existing account with same email
      if (account && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (existingUser) {
          // Check if this provider is already linked
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });
          // Link the provider account to the existing user if not already linked
          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token ?? null,
                access_token: account.access_token ?? null,
                expires_at: account.expires_at ?? null,
                token_type: account.token_type ?? null,
                scope: account.scope ?? null,
                id_token: account.id_token ?? null,
                session_state: account.session_state
                  ? String(account.session_state)
                  : null,
              },
            });
          }
          // Set the user id to the existing user so the session is correct
          user.id = String(existingUser.id);
        }
      }

      return true;
    },

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
          accessTokenExpires:
            Date.now() +
            parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRE || "3600") * 1000,
        };
      }

      // If access token still valid
      if (
        token.accessTokenExpires &&
        Date.now() < (token.accessTokenExpires as number)
      ) {
        return token;
      }

      // Need to refresh
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.role =
        token.role as (typeof USER_ROLE)[keyof typeof USER_ROLE];
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
