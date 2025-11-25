// services/UserService.ts
import http from "@/services/factory"; // ← singleton http
import type { ApiResponse, PaginatedApiResponse } from "@/types/common";
import type {
  UserLoginDto,
  UserRegisterDto,
  JWTResponseDto,
  User,
  CreateUserDto,
  UpdateUserDto,
} from "@/types/users";

type UserSearchParams = {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  search?: string;
};

class UserService {
  private readonly PREFIX = "/api/users";
  private readonly MANAGE_PREFIX = "/api/users/manage";

  /** POST /api/users/signup */
  async signup(data: UserRegisterDto) {
    return http.call<ApiResponse<JWTResponseDto>>({
      method: "POST",
      url: `${this.PREFIX}/signup`,
      body: data,
    });
  }

  /** POST /api/users/login */
  async login(data: UserLoginDto) {
    return http.call<ApiResponse<JWTResponseDto>>({
      method: "POST",
      url: `${this.PREFIX}/login`,
      body: data,
    });
  }

  /** GET /api/users → refresh access token via refreshToken cookie */
  async authenticate() {
    return http.call<ApiResponse<JWTResponseDto>>({
      method: "GET",
      url: this.PREFIX,
    });
  }

  /** POST /api/users/log-out */
  async logout() {
    return http.call<ApiResponse<void>>({
      method: "POST",
      url: `${this.PREFIX}/log-out`,
    });
  }

  /** GET /api/users/manage → Admin: get all users */
  async getAllUsers(accessToken: string, params?: UserSearchParams) {
    return http.call<PaginatedApiResponse<User & { postCount?: number }>>({
      method: "GET",
      url: this.MANAGE_PREFIX,
      params,
      accessToken
    });
  }

  /** GET /api/users/manage/:id */
  async getUserById(accessToken: string, id: number) {
    return http.call<ApiResponse<User & { postCount?: number }>>({
      method: "GET",
      url: `${this.MANAGE_PREFIX}/${id}`,
      accessToken
    });
  }

  async getInfo(accessToken: string) {
    return http.call<ApiResponse<User>>({
      method: "GET",
      url: `${this.PREFIX}/me`,
      accessToken
    });
  }

  /** POST /api/users/manage → Admin: create user */
  async createUser(accessToken: string, data: CreateUserDto) {
    return http.call<ApiResponse<User>>({
      method: "POST",
      url: this.MANAGE_PREFIX,
      body: data,
      accessToken
    });
  }

  /** PUT /api/users/manage/:id */
  async updateUser(accessToken: string, id: number, data: UpdateUserDto) {
    return http.call<ApiResponse<User>>({
      method: "PUT",
      url: `${this.MANAGE_PREFIX}/${id}`,
      body: data,
      accessToken
    });
  }

  /** DELETE /api/users/manage/:id */
  async deleteUser(accessToken: string, id: number) {
    return http.call<ApiResponse<void>>({
      method: "DELETE",
      url: `${this.MANAGE_PREFIX}/${id}`,
      accessToken
    });
  }
}

// Export both ways — consistent with all other services
export const userService = new UserService();
export default userService;