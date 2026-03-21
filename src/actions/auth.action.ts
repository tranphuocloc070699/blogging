"use server";
import { auth } from "@/auth";
import { USER_ROLE } from "@/config/enums";
import { withMonitoredServerAction } from "@/lib/sentry-monitoring";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
export async function requireAuth(redirectUrl?: string): Promise<Session> {
  return withMonitoredServerAction("auth.requireAuth", async () => {
    const session = await auth();
    if (!session?.user) {
      redirect(redirectUrl ?? "/login");
    }
    return session;
  });
}
export async function requireAdmin(redirectUrl?: string): Promise<Session> {
  return withMonitoredServerAction("auth.requireAdmin", async () => {
    const session = await auth();
    if (!session?.user || session?.user?.role !== USER_ROLE.ADMIN) {
      redirect(redirectUrl ?? "/login");
    }
    return session;
  });
}

export async function getAuthSession(): Promise<Session | null> {
  return withMonitoredServerAction("auth.getAuthSession", async () => auth());
}
