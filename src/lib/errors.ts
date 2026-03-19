import { ApiRequestError } from "./app-error";

export function getErrorMessage(error: unknown): {
  message: string;
  hint?: string;
  retryable: boolean;
  code?: string;
} {
  if (isApiRequestError(error)) {
    console.log({ error });
    return {
      message: "Resources are temporarily unavailable.",
      hint: "Please try again later.",
      retryable: true,
    };
  }
  return {
    message: "An unexpected error occurred.",
    hint: "Please try again later.",
    retryable: true,
  };
}

function isApiRequestError(error: unknown): error is ApiRequestError {
  return error instanceof Error && error.name === "ApiRequestError";
}
