// import "@/lib/envConfig"

interface HttpRequest {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  body?: object | FormData;
  params?: any;
  accessToken?: string | null;
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

  const base = process.env.NEXT_PUBLIC_API_URL ?? process.env.BACKEND_DOMAIN;
  return `${base}${url}`;
};

const buildHeaders = (
  accessToken?: string | null,
  body?: object | FormData
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
}

class HttpFactory {
  async call<T>({
    method,
    url,
    body,
    params,
    accessToken,
  }: HttpRequest): Promise<HttpResponse<T>> {
    const absoluteUrl = getAbsoluteUrl(url);
    const finalUrl = buildUrl(absoluteUrl, params);
    const headers = buildHeaders(accessToken, body);
    const requestBody = buildBody(body);

    const options: RequestInit = {
      method,
      headers,
      credentials: "include",
      body: requestBody,
    };

    const response = await fetch(finalUrl, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    let data: T;
    const contentType = response.headers.get("content-type");
    data = contentType?.includes("json") ? await response.json() : await response.text();

    return { headers: response.headers, body: data };
  }
}

// Export singleton – one instance for the whole app
export const http = new HttpFactory();
export default http;