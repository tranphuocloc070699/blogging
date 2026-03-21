import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import { captureApiRouteError } from "@/lib/sentry-monitoring";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return successResponse(
      {
        database: "up",
      },
      "Database connection healthy",
    );
  } catch (error) {
    console.error("Prisma health check failed:", error);
    captureApiRouteError(error, { method: "GET", route: "/api/health/prisma" });
    return errorResponse("Database connection unavailable", 503, {
      code: "DATABASE_UNAVAILABLE",
      retryable: true,
    });
  }
}
