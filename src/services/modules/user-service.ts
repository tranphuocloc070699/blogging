import type { ApiResponse, PaginatedApiResponse } from "@/types/common";
import HttpFactory from "../factory";
import {
  UserLoginDto,
  UserRegisterDto,
  JWTResponseDto,
  User,
  CreateUserDto,
  UpdateUserDto
} from "@/types/users";

class UserService extends HttpFactory {
  readonly PREFIX: string = "/api/users";
  readonly MANAGE_PREFIX: string = "/api/users/manage";

  /**
   * POST /api/users/signup
   * Registers a new user
   */
  async signup(requestData: UserRegisterDto) {
    return this.call<ApiResponse<JWTResponseDto>>({
      method: "POST",
      url: `${this.PREFIX}/signup`,
      body: requestData
    });
  }

  /**
   * POST /api/users/login
   * Authenticates user with email and password
   */
  async login(requestData: UserLoginDto) {
    return this.call<ApiResponse<JWTResponseDto>>({
      method: "POST",
      url: `${this.PREFIX}/login`,
      body: requestData
    });
  }

  /**
   * GET /api/users
   * Validates refresh token from cookies and generates new access token
   */
  async authenticate() {
    return this.call<ApiResponse<JWTResponseDto>>({
      method: "GET",
      url: this.PREFIX,
    });
  }

  /**
   * POST /api/users/log-out
   * Logs out user by deleting refresh token cookie
   */
  async logout() {
    return this.call<ApiResponse<void>>({
      method: "POST",
      url: `${this.PREFIX}/log-out`,
    });
  }

  /**
   * GET /api/users/manage
   * Get all users with pagination (Admin only)
   */
  async getAllUsers(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.set('page', params.page.toString());
    if (params?.size !== undefined) searchParams.set('size', params.size.toString());
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.sortDir) searchParams.set('sortDir', params.sortDir);
    if (params?.search) searchParams.set('search', params.search);

    return this.call<PaginatedApiResponse<User & { postCount?: number }>>({
      method: "GET",
      url: `${this.MANAGE_PREFIX}?${searchParams.toString()}`,
    });
  }

  /**
   * GET /api/users/manage/:id
   * Get user by ID (Admin only)
   */
  async getUserById(id: number) {
    return this.call<ApiResponse<User & { postCount?: number }>>({
      method: "GET",
      url: `${this.MANAGE_PREFIX}/${id}`,
    });
  }

  /**
   * POST /api/users/manage
   * Create a new user (Admin only)
   */
  async createUser(requestData: CreateUserDto) {
    return this.call<ApiResponse<User>>({
      method: "POST",
      url: this.MANAGE_PREFIX,
      body: requestData
    });
  }

  /**
   * PUT /api/users/manage/:id
   * Update user (Admin only)
   */
  async updateUser(id: number, requestData: UpdateUserDto) {
    return this.call<ApiResponse<User>>({
      method: "PUT",
      url: `${this.MANAGE_PREFIX}/${id}`,
      body: requestData
    });
  }

  /**
   * DELETE /api/users/manage/:id
   * Delete user (Admin only)
   */
  async deleteUser(id: number) {
    return this.call<ApiResponse<void>>({
      method: "DELETE",
      url: `${this.MANAGE_PREFIX}/${id}`,
    });
  }
}

// Export singleton instance
export default UserService;