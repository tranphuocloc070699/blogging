import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/response";
import { HEADER_AUTHORIZATION } from "@/config/enums";
import { getUserFromAuthHeader } from "@/lib/auth.util";
import { postServerService } from "@/services/modules/post-server-service";
import { captureApiRouteError } from "@/lib/sentry-monitoring";

// GET /api/posts/published - Get published posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const authorization = request.headers.get(HEADER_AUTHORIZATION);

    const user = getUserFromAuthHeader(authorization ?? "");
    const userId = user?.userId;

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const size = parseInt(searchParams.get("size") || pageSize.toString());
    const sortBy = searchParams.get("sortBy") || "publishedAt";
    const sortDir = searchParams.get("sortDir") || "desc";
    const search = searchParams.get("search"); // Search in both title and excerpt
    const tag = searchParams.get("tag"); // Filter by tag slug

    const payload = await postServerService.getPublishedPosts(
      {
        page,
        size,
        sortBy,
        sortDir: sortDir as "asc" | "desc",
        search: search ?? undefined,
        tag: tag ?? undefined,
      },
      userId,
    );
    return successResponse(payload);
  } catch (error) {
    console.error("Get published posts error:", error);
    captureApiRouteError(error, {
      method: "GET",
      route: "/api/posts/published",
    });
    return errorResponse("Failed to fetch published posts", 500);
  }
}
