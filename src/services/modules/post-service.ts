import type { PaginatedApiResponse, ApiResponse, SearchParams } from "@/types/common";
import HttpFactory from "../factory";
import {
  PostDto,
  PostSummaryDto,
  CreatePostDto,
  UpdatePostDto
} from "@/types/posts";
import { PostFormData } from "@/app/auth/posts/upsave/page";
import { getClientOrServerUrl } from "@/lib/api-utils";
export interface PostSearchParams extends SearchParams {
  status?: 'DRAFT' | 'PUBLISHED';
  keyword?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';

}

export interface PublishedPostsParams extends SearchParams {
  search?: string; // Search in title and excerpt
  tag?: string; // Filter by tag slug
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PublishedPostsResponse {
  posts: any[];
  hasMore: boolean;
  total: number;
  currentPage: number;
}

class PostService extends HttpFactory {
  readonly PREFIX: string = `${getClientOrServerUrl()}/posts`;

  // GET /posts - Get all posts with pagination, filtering, and search
  async getAllPosts(params: PostSearchParams = {}) {
    return this.call<PaginatedApiResponse<PostSummaryDto>>({
      method: "GET",
      url: this.PREFIX,
      params: Object.keys(params).length > 0 ? params : undefined
    });
  }

  async getPostBySlug(slug: string) {
    return this.call<ApiResponse<PostDto>>({
      method: "GET",
      url: `${this.PREFIX}/slug/${slug}`,
    });
  }



  // GET /posts/{id} - Get post by ID
  async getPostById(id: number) {
    return this.call<ApiResponse<PostDto>>({
      method: "GET",
      url: `${this.PREFIX}/${id}`
    });
  }


  async getPostByIdForUpsave(id: number) {
    return this.call<ApiResponse<PostFormData>>({
      method: "GET",
      url: `${this.PREFIX}/${id}`,
      params: {
        upsave: true
      }
    });
  }


  // GET /posts/published - Get published posts
  async getPublishedPosts(params: PublishedPostsParams = {}) {
    return this.call<ApiResponse<PublishedPostsResponse>>({
      method: "GET",
      url: `${this.PREFIX}/published`,
      params: Object.keys(params).length > 0 ? params : undefined
    });
  }

  // POST /posts - Create a new post
  async createPost(dto: CreatePostDto) {
    return this.call<ApiResponse<PostDto>>({
      method: "POST",
      url: `${this.PREFIX}`,
      body: dto
    });
  }

  // PUT /posts/{id} - Update a post
  async updatePost(id: number, dto: UpdatePostDto) {
    return this.call<ApiResponse<PostDto>>({
      method: "PUT",
      url: `${this.PREFIX}/${id}`,
      body: dto
    });
  }

  // PATCH /posts/{id}/publish - Publish a post
  async publishPost(id: number) {
    return this.call<ApiResponse<PostDto>>({
      method: "PATCH",
      url: `${this.PREFIX}/${id}/publish`
    });
  }

  // PATCH /posts/{id}/unpublish - Unpublish a post
  async unpublishPost(id: number) {
    return this.call<ApiResponse<PostDto>>({
      method: "PATCH",
      url: `${this.PREFIX}/${id}/unpublish`
    });
  }

  // GET /posts/term/{termSlug} - Get posts by term slug
  async getPostsByTermSlug(termSlug: string, params: SearchParams = {}) {
    return this.call<PaginatedApiResponse<PostSummaryDto>>({
      method: "GET",
      url: `${this.PREFIX}/term/${termSlug}`,
      params: Object.keys(params).length > 0 ? params : undefined
    });
  }

  // GET /posts/taxonomy/{taxonomySlug} - Get posts by taxonomy slug
  async getPostsByTaxonomySlug(taxonomySlug: string, params: SearchParams = {}) {
    return this.call<PaginatedApiResponse<PostSummaryDto>>({
      method: "GET",
      url: `${this.PREFIX}/taxonomy/${taxonomySlug}`,
      params: Object.keys(params).length > 0 ? params : undefined
    });
  }

  // GET /posts/taxonomy/id/{taxonomyId} - Get posts by taxonomy ID
  async getPostsByTaxonomyId(taxonomyId: number, params: SearchParams = {}) {
    return this.call<PaginatedApiResponse<PostSummaryDto>>({
      method: "GET",
      url: `${this.PREFIX}/taxonomy/id/${taxonomyId}`,
      params: Object.keys(params).length > 0 ? params : undefined
    });
  }

  // GET /posts/term/id/{termId} - Get posts by term ID
  async getPostsByTermId(termId: number, params: SearchParams = {}) {
    return this.call<PaginatedApiResponse<PostSummaryDto>>({
      method: "GET",
      url: `${this.PREFIX}/term/id/${termId}`,
      params: Object.keys(params).length > 0 ? params : undefined
    });
  }

  // GET /posts/taxonomy/{taxonomySlug}/term/{termSlug} - Get posts by term and taxonomy slug
  async getPostsByTermSlugAndTaxonomySlug(taxonomySlug: string, termSlug: string, params: SearchParams = {}) {
    return this.call<PaginatedApiResponse<PostSummaryDto>>({
      method: "GET",
      url: `${this.PREFIX}/taxonomy/${taxonomySlug}/term/${termSlug}`,
      params: Object.keys(params).length > 0 ? params : undefined
    });
  }

  // DELETE /posts/{id} - Delete a post
  async deletePost(id: number) {
    return this.call<ApiResponse<void>>({
      method: "DELETE",
      url: `${this.PREFIX}/${id}`
    });
  }

  // PUT /posts/{id}/like - Toggle like on a post
  async toggleLike(id: number) {
    return this.call<ApiResponse<{ isLiked: boolean; likesCount: number }>>({
      method: "PUT",
      url: `${this.PREFIX}/${id}/like`
    });
  }

  // GET /posts/my-viewed - Get posts the user has viewed
  async getMyViewedPosts(params: SearchParams = {}) {
    return this.call<ApiResponse<PublishedPostsResponse>>({
      method: "GET",
      url: `${this.PREFIX}/my-viewed`,
      params: Object.keys(params).length > 0 ? params : undefined
    });
  }

  // GET /posts/my-liked - Get posts the user has liked
  async getMyLikedPosts(params: SearchParams = {}) {
    return this.call<ApiResponse<PublishedPostsResponse>>({
      method: "GET",
      url: `${this.PREFIX}/my-liked`,
      params: Object.keys(params).length > 0 ? params : undefined
    });
  }
}

export default PostService;