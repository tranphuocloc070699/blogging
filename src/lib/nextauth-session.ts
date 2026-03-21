import "server-only";

import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";

export async function getNextAuthUserIdFromSessionCookie(): Promise<number | undefined> {
  const token = await getToken({
    req: { headers: await headers() } as unknown as Parameters<typeof getToken>[0]["req"],
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });

  const rawId = token?.id ?? token?.sub;
  if (!rawId) {
    return undefined;
  }

  const parsed = Number(rawId);
  return Number.isFinite(parsed) ? parsed : undefined;
}

