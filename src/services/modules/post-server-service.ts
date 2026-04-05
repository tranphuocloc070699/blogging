import {
  createPostAction,
  deletePostAction,
  getAdminPostsAction,
  getPostByIdAction,
  getPublishedPostBySlugAction,
  getPublishedPostsAction,
  publishPostAction,
  unpublishPostAction,
  updatePostAction,
} from "@/actions/content/post.action";
import type { PostSearchParams, PublishedPostsParams } from "@/services/modules/post-service";
import type { CreatePostDto, UpdatePostDto } from "@/types/posts";

class PostServerService {
  async getAllPosts(params?: PostSearchParams) {
    return getAdminPostsAction({
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      sortBy: params?.sortBy ?? "createdAt",
      sortDir: params?.sortDir ?? "desc",
      status: params?.status ?? null,
      keyword: params?.keyword ?? null,
    });
  }

  async getPostById(id: number) {
    return getPostByIdAction(id);
  }

  async getPublishedPosts(params?: Omit<PublishedPostsParams, "accessToken">, userId?: number) {
    return getPublishedPostsAction(
      {
        page: params?.page ?? 1,
        size: params?.size ?? 10,
        sortBy: params?.sortBy ?? "publishedAt",
        sortDir: params?.sortDir ?? "desc",
        search: params?.search ?? null,
        tag: params?.tag ?? null,
      },
      userId,
    );
  }

  async getPostBySlug(slug: string, userId?: number) {
    return getPublishedPostBySlugAction(slug, userId);
  }

  async createPost(authorId: number, dto: CreatePostDto) {
    return createPostAction({
      ...dto,
      authorId,
      keywords: dto.keywords,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
    });
  }

  async updatePost(id: number, dto: UpdatePostDto) {
    return updatePostAction(id, {
      ...dto,
      status: dto.status as "DRAFT" | "PUBLISHED" | undefined,
      keywords: dto.keywords,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
    });
  }

  async deletePost(id: number) {
    return deletePostAction(id);
  }

  async publishPost(id: number) {
    return publishPostAction(id);
  }

  async unpublishPost(id: number) {
    return unpublishPostAction(id);
  }
}

export const postServerService = new PostServerService();
