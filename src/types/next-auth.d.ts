// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { USER_ROLE } from '@/config/enums';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: typeof USER_ROLE[keyof typeof USER_ROLE];
    } & DefaultSession["user"];
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }

  interface User extends DefaultUser {
    username: string;
    role: typeof USER_ROLE[keyof typeof USER_ROLE];
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: typeof USER_ROLE[keyof typeof USER_ROLE];
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: string;
  }
}