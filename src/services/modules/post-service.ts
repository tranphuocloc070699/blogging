// services/PostService.ts
import http from "@/services/factory"; // ← your singleton http
import type { PaginatedApiResponse, ApiResponse, SearchParams } from "@/types/common";
import type {
  PostDto,
  PostSummaryDto,
  CreatePostDto,
  UpdatePostDto,
} from "@/types/posts";
import { PostFormData } from "@/app/auth/posts/upsave/page";

export interface PostSearchParams extends SearchParams {
  status?: "DRAFT" | "PUBLISHED";
  keyword?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface PublishedPostsParams extends SearchParams {
  search?: string;
  tag?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface PublishedPostsResponse {
  posts: any[];
  hasMore: boolean;
  total: number;
  currentPage: number;
}

class PostService {
  private readonly PREFIX = "/api/posts";

  /** Admin: Get all posts (paginated + filtered) */
  async getAllPosts(params?: PostSearchParams) {
    return http.call<PaginatedApiResponse<PostSummaryDto>>({
      method: "GET",
      url: this.PREFIX,
      params,
    });
  }
  /** Get single post by slug (public or admin) */
  async getPostBySlug(slug: string, accessToken?: string,) {
    return http.call<ApiResponse<PostDto>>({
      method: "GET",
      url: `${this.PREFIX}/slug/${slug}`,
      accessToken
    });
  }

  /** Get post by ID */
  async getPostById(id: number) {
    return http.call<ApiResponse<PostDto>>({
      method: "GET",
      url: `${this.PREFIX}/${id}`,
    });
  }

  /** Get post with full form data for editing (upsave mode) */
  async getPostByIdForUpsave(id: number) {
    return http.call<ApiResponse<PostFormData>>({
      method: "GET",
      url: `${this.PREFIX}/${id}`,
      params: { upsave: true },
    });
  }

  /** Public: Get published posts */
  async getPublishedPosts(params?: Omit<PublishedPostsParams, "accessToken">,
    accessToken?: string) {
    return http.call<ApiResponse<PublishedPostsResponse>>({
      method: "GET",
      url: `${this.PREFIX}/published`,
      params,
      accessToken
    });
  }

  /** Create new post */
  async createPost(accessToken: string, dto: CreatePostDto) {
    return http.call<ApiResponse<PostDto>>({
      method: "POST",
      url: this.PREFIX,
      body: dto,
      accessToken
    });
  }

  /** Update post */
  async updatePost(accessToken: string, id: number, dto: UpdatePostDto) {
    return http.call<ApiResponse<PostDto>>({
      method: "PUT",
      url: `${this.PREFIX}/${id}`,
      body: dto,
      accessToken
    });
  }

  /** Publish / Unpublish */
  async publishPost(id: number) {
    return http.call<ApiResponse<PostDto>>({
      method: "PATCH",
      url: `${this.PREFIX}/${id}/publish`,
    });
  }

  async unpublishPost(id: number) {
    return http.call<ApiResponse<PostDto>>({
      method: "PATCH",
      url: `${this.PREFIX}/${id}/unpublish`,
    });
  }

  /** Filter by term/tag */
  async getPostsByTermSlug(termSlug: string, params?: SearchParams) {
    return http.call<PaginatedApiResponse<PostSummaryDto>>({
      method: "GET",
      url: `${this.PREFIX}/term/${termSlug}`,
      params,
    });
  }

  async getPostsByTaxonomySlug(taxonomySlug: string, params?: SearchParams) {
    return http.call<PaginatedApiResponse<PostSummaryDto>>({
      method: "GET",
      url: `${this.PREFIX}/taxonomy/${taxonomySlug}`,
      params,
    });
  }

  async getPostsByTaxonomyId(taxonomyId: number, params?: SearchParams) {
    return http.call<PaginatedApiResponse<PostSummaryDto>>({
      method: "GET",
      url: `${this.PREFIX}/taxonomy/id/${taxonomyId}`,
      params,
    });
  }

  async getPostsByTermId(termId: number, params?: SearchParams) {
    return http.call<PaginatedApiResponse<PostSummaryDto>>({
      method: "GET",
      url: `${this.PREFIX}/term/id/${termId}`,
      params,
    });
  }

  async getPostsByTermSlugAndTaxonomySlug(
    taxonomySlug: string,
    termSlug: string,
    params?: SearchParams
  ) {
    return http.call<PaginatedApiResponse<PostSummaryDto>>({
      method: "GET",
      url: `${this.PREFIX}/taxonomy/${taxonomySlug}/term/${termSlug}`,
      params,
    });
  }

  /** Actions */

  async deletePost(accessToken: string, id: number) {
    return http.call<ApiResponse<void>>({
      method: "DELETE",
      url: `${this.PREFIX}/${id}`,
      accessToken
    });
  }

  async toggleLike(accessToken: string, id: number) {
    return http.call<ApiResponse<{ isLiked: boolean; likesCount: number }>>({
      method: "PUT",
      url: `${this.PREFIX}/${id}/like`,
      accessToken
    });
  }

  async getMyViewedPosts(params?: SearchParams) {
    return http.call<ApiResponse<PublishedPostsResponse>>({
      method: "GET",
      url: `${this.PREFIX}/my-viewed`,
      params,
    });
  }

  async getMyLikedPosts(props: SearchParams) {
    const { accessToken, ...params } = props;
    return http.call<ApiResponse<PublishedPostsResponse>>({
      method: "GET",
      url: `${this.PREFIX}/my-liked`,
      params,
      accessToken
    });
  }
}

// Export both ways for flexibility
export const postService = new PostService();
export default postService;