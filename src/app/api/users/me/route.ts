import { HEADER_AUTHORIZATION } from "@/config/enums";
import { getUserFromAuthHeader } from "@/lib/auth.util";
import prisma from "@/lib/prisma";
import { errorResponse, forbiddenResponse, successResponse } from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
) {
    try {
        const authorization = request.headers.get(HEADER_AUTHORIZATION);
        const tokenPayload = getUserFromAuthHeader(authorization ?? "");
        if (!tokenPayload) throw forbiddenResponse('Not authenticated');

        const user = await prisma.user.findUnique({
            where: { id: tokenPayload.userId },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return successResponse(user, "Get info success");


    } catch (error) {
        // If it's already a Response (from middleware), return it
        if (error instanceof Response) {
            return error;
        }
        console.error('Get user error:', error);
        return errorResponse('Failed to fetch user', 500);
    }
}