export interface UserRegisterDto {
  username: string;
  email?: string;
  password: string;
}

export interface UserLoginDto {
  email?: string;
  username?: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JWTResponseDto {
  accessToken: string;
  refreshToken:string;
  data: User;
}

export interface CreateUserDto {
  username: string;
  email?: string;
  password: string;
  role?: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

export const initialUser: User = {
  id:'',
  username:'',
  role:'',
  createdAt:'',
  updatedAt:'',
}