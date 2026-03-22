// import "@/lib/envConfig"
import { ApiRequestError, parseApiErrorPayload } from "@/lib/app-error";

interface HttpRequest {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  body?: object | FormData;
  params?: any;
  accessToken?: string | null;
  timeout?: number;
}

interface HttpResponse<T> {
  headers: Headers;
  body: T;
}
const buildUrl = (url: string, params?: Record<string, any>): string => {
  if (!params) return url;

  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value != null) {
      search.append(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `${url}?${query}` : url;
};

const getAbsoluteUrl = (url: string): string => {
  if (typeof window !== "undefined" || !url.startsWith("/")) return url;

  const base = process.env.NEXT_PUBLIC_API_URL;
  return `${base}${url}`;
};

const buildHeaders = (
  accessToken?: string | null,
  body?: object | FormData,
): Headers => {
  const headers = new Headers();

  // Only set JSON content-type if body is NOT FormData
  if (!body || !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
};

const buildBody = (body?: object | FormData) => {
  if (!body) return undefined;
  if (body instanceof FormData) return body;
  return JSON.stringify(body);
};

class HttpFactory {
  private readonly MAX_RETRIES = 3;
  private readonly REQUEST_TIMEOUT_MS = 5000;

  private isRetryableStatus(status: number): boolean {
    return status === 408 || status === 429 || status >= 500;
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async call<T>({
    method,
    url,
    body,
    params,
    accessToken,
    timeout,
  }: HttpRequest): Promise<HttpResponse<T>> {
    const absoluteUrl = getAbsoluteUrl(url);
    const finalUrl = buildUrl(absoluteUrl, params);
    const headers = buildHeaders(accessToken, body);
    const requestBody = buildBody(body);
    const timeoutMs = timeout ?? this.REQUEST_TIMEOUT_MS;

    let lastError: unknown;
    const canRetry = method === "GET";

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt += 1) {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        timeoutMs,
      );

      try {
        const options: RequestInit = {
          method,
          headers,
          credentials: "include",
          body: requestBody,
          signal: controller.signal,
        };

        const response = await fetch(finalUrl, options);
        const shouldRetry =
          canRetry &&
          this.isRetryableStatus(response.status) &&
          attempt < this.MAX_RETRIES;

        if (shouldRetry) {
          await this.delay(200 * attempt);
          continue;
        }

        const contentType = response.headers.get("content-type");
        const data = contentType?.includes("json")
          ? await response.json()
          : await response.text();

        if (!response.ok) {
          const payload = parseApiErrorPayload(data);

          throw new ApiRequestError(
            payload?.message ||
              `HTTP ${response.status}: ${response.statusText}`,
            {
              status: response.status,
              code: payload?.errors?.code,
              retryable: payload?.errors?.retryable,
              details: data,
            },
          );
        }

        return { headers: response.headers, body: data };
      } catch (error) {
        lastError = error;

        const isTimeout =
          error instanceof DOMException && error.name === "AbortError";
        const shouldRetry = canRetry && attempt < this.MAX_RETRIES;

        if (isTimeout && !shouldRetry) {
          throw new ApiRequestError(`Request timed out after ${timeoutMs / 1000}s`, {
            status: 504,
            retryable: false,
          });
        }

        if (!shouldRetry) {
          throw error;
        }

        await this.delay(200 * attempt);
      } finally {
        clearTimeout(timeoutId);
      }
    }

    throw (
      lastError ??
      new ApiRequestError("Request failed after retries", {
        status: 500,
        retryable: false,
      })
    );
  }
}

// Export singleton – one instance for the whole app
export const http = new HttpFactory();
export default http;
