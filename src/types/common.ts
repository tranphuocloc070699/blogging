import { FieldError, UseFormRegister } from "react-hook-form";

export type FormFieldProps = {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};

export type ResponseDto<T> = {
  status: number;
  data: T;
  message: string;
  metadata?: PaginationMetadata;
  errors?: string;
};

export interface PaginationMetadata {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  isFull?:boolean;
}

export type PaginationParams = {
  page?: number;
  size?: number;
  sort?: string;
  sortDir?: 'asc' | 'desc';
};

export type SearchParams = PaginationParams & {
  search?: string;
  accessToken?:string;
};

export type SearchParamsWithAuth = SearchParams & {
  accessToken:string;
}

// Specific response types for API responses
export type PaginatedApiResponse<T> = ResponseDto<T[]>;
export type ApiResponse<T> = ResponseDto<T>;