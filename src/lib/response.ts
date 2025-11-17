import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data?: T;
  metadata?: PaginationMetadata;
  errors?: any;
}

export interface PaginationMetadata {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export function successResponse<T>(data: T, message: string = 'Success', status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    status,
    message,
    data,
  }, { status });
}

export function paginatedResponse<T>(
  data: T[],
  metadata: PaginationMetadata,
  message: string = 'Success',
  status: number = 200
): NextResponse<ApiResponse<T[]>> {
  return NextResponse.json({
    status,
    message,
    data,
    metadata,
  }, { status });
}

export function errorResponse(message: string, status: number = 400, errors?: any): NextResponse<ApiResponse> {
  return NextResponse.json({
    status,
    message,
    errors,
  }, { status });
}

export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse<ApiResponse> {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message: string = 'Forbidden'): NextResponse<ApiResponse> {
  return errorResponse(message, 403);
}

export function notFoundResponse(message: string = 'Not found'): NextResponse<ApiResponse> {
  return errorResponse(message, 404);
}

export function conflictResponse(message: string = 'Conflict'): NextResponse<ApiResponse> {
  return errorResponse(message, 409);
}

export function serverErrorResponse(message: string = 'Internal server error'): NextResponse<ApiResponse> {
  return errorResponse(message, 500);
}
