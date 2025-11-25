"use server"
import { auth } from "@/auth"
import { USER_ROLE } from "@/config/enums";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
export async function requireAuth(redirectUrl?: string): Promise<Session> {
    const session = await auth();
    if (!session?.user) {
        redirect(redirectUrl ?? "/login");
    }
    return session;
}
export async function requireAdmin(redirectUrl?: string): Promise<Session> {
    const session = await auth();
    if (!session?.user || session?.user?.role !== USER_ROLE.ADMIN) {
        redirect(redirectUrl ?? "/login");
    }
    return session;
}

export async function getAuthSession(): Promise<Session | null> {
    const session = await auth()
    return session;
}