import { useUserStore } from "@/store/user.store";
interface IHttpFactory {
  method:
    | "GET"
    | "HEAD"
    | "PATCH"
    | "POST"
    | "PUT"
    | "DELETE"
    | "CONNECT"
    | "OPTIONS"
    | "TRACE"
    | "get"
    | "head"
    | "patch"
    | "post"
    | "put"
    | "delete"
    | "connect"
    | "options"
    | "trace";
  url: string;
  fetchOptions?: RequestInit;
  body?: object;
  params?: any;
}

interface IResponse<T> {
  headers: Headers,
  body: T
}

class HttpFactory {
  async call<T>({
                  method,
                  url,
                  fetchOptions,
                  body,
                  params
                }: IHttpFactory): Promise<IResponse<T>> {



    const headers = new Headers();

    if(typeof window ==="undefined"){
         const { cookies } = await import('next/headers');
         const cookieStore = await cookies();
         headers.set("cookie",cookieStore.toString());
    }


    const options: RequestInit = {
      method,
      headers,
      cache: "no-store",
      credentials: "include",
      ...fetchOptions
    };

    if (body) {
      if (body instanceof FormData) options.body = body as BodyInit;
      else {
        options.body = JSON.stringify(body);
        headers.set("Content-Type", "application/json");
        options.headers = headers;
      }
    }
    try {
      let newUrl = url;
      if (params) {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null) {
            searchParams.append(key, params[key]);
          }
        });
        newUrl = `${url}?${searchParams.toString()}`;
      }

      const response = await fetch(newUrl, options);
      // Handle 401/403 errors by clearing auth
      if (!response.ok && (response.status === 401 || response.status === 403)) {
        this.clearAuth();
        throw new Error("Unauthorized");
      }

      const responseBody = await response.json();
      return { headers: response.headers, body: responseBody };
    } catch (error) {
      throw new Error(`Fetch error: ${(error as Error).message}`);
    }
  }

  // Get access token from Zustand store
  private getAccessToken(): string {
    return useUserStore.getState().accessToken;
  }

  private clearAuth(): void {
    useUserStore.getState().setAccessToken("");
    useUserStore.getState().setUser({
      id: "",
      username: "",
      role: "",
      createdAt: "",
      updatedAt: "",
    });
  }
}

export default HttpFactory;