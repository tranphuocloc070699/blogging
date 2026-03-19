type ApiErrorPayload = {
  message?: string;
  errors?: {
    code?: string;
    retryable?: boolean;
    [key: string]: unknown;
  };
};

export class ApiRequestError extends Error {
  status: number;
  code?: string;
  retryable?: boolean;
  details?: unknown;

  constructor(
    message: string,
    options: {
      status: number;
      code?: string;
      retryable?: boolean;
      details?: unknown;
    }
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = options.status;
    this.code = options.code;
    this.retryable = options.retryable;
    this.details = options.details;
  }
}

export function parseApiErrorPayload(payload: unknown): ApiErrorPayload | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const parsed = payload as ApiErrorPayload;
  return parsed;
}

export function isDatabaseUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const prismaError = error as {
    code?: string;
    name?: string;
    message?: string;
  };

  if (prismaError.code === 'P1001') {
    return true;
  }

  if (prismaError.name === 'PrismaClientInitializationError') {
    return true;
  }

  const message = prismaError.message?.toLowerCase() ?? '';

  return (
    message.includes("can't reach database server") ||
    message.includes('database server') ||
    message.includes('connection refused') ||
    message.includes('connect timed out')
  );
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
