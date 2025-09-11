export type ResponseType<T> =
  | { error: ErrorType; success: null }
  | { success: DataType<T>; error: null };

export type DataType<T = any> = {
  data?: T;
  message?: string;
};

export type ErrorType = {
  statusCode: number;
  message: string;
  details?: any;
};

export type MethodType = "POST" | "GET" | "DELETE" | "PATCH" | "PUT";

export type QueryOptionsType = {
  headers?: HeadersInit;
  body?: any;
  query?: Record<string, string>;
  params?: Record<string, string>;
  autorefreshToken?: boolean;
};

type QueryParamType = {
  method: MethodType;
  url: string;
  headers?: HeadersInit;
  body?: any;
  autorefreshToken?: boolean;
};

export interface RefreshHandler {
  getRefreshToken: () => string | null;
  saveSession: (data: any) => void;
  onRefreshFail?: () => Promise<void>; // ex: redirect
}

export interface HttpServiceOptions {
  apiBaseUrl: string;
  refreshEndpoint: string;
  refreshHandler?: RefreshHandler;
}

function objectToQueryString(obj: Record<string, string>): string {
  return new URLSearchParams(obj).toString();
}

function replaceUrlParams(url: string, params: Record<string, string>) {
  return url.replace(/:(\w+)/g, (_, key) => params[key] ?? "");
}

export function createHttpService(config: HttpServiceOptions) {
  const API_BASE_URL = config.apiBaseUrl;
  const DEFAULT_HEADERS: HeadersInit = { "Content-Type": "application/json" };

  async function refreshTokenIfNeeded(
    response: Response,
    options: QueryParamType
  ): Promise<Response> {
    if (
      response.status !== 401 ||
      !options.autorefreshToken ||
      !config.refreshHandler
    )
      return response;

    const token = config.refreshHandler.getRefreshToken();
    if (!token) return response;

    const refreshResp = await fetch(`${API_BASE_URL}${config.refreshEndpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!refreshResp.ok) {
      if (config.refreshHandler.onRefreshFail) {
        await config.refreshHandler.onRefreshFail();
      }
      return response;
    }

    const { data } = (await refreshResp.json()) as DataType<any>;
    if (data) config.refreshHandler.saveSession(data);

    // retry original request
    return fetch(options.url, {
      method: options.method,
      headers: options.headers,
      body: options.body,
      credentials: "include",
    });
  }

  async function request<T>({
    method,
    url,
    headers,
    body,
    autorefreshToken,
  }: QueryParamType): Promise<ResponseType<T>> {
    const configReq: RequestInit = {
      method,
      headers: { ...DEFAULT_HEADERS, ...headers },
      credentials: "include",
      body: method !== "GET" && body ? JSON.stringify(body) : undefined,
    };

    let response = await fetch(url, configReq);
    response = await refreshTokenIfNeeded(response, {
      method,
      url,
      headers,
      body,
      autorefreshToken,
    });

    if (!response.ok) {
      const { message, errors } = await response.json();
      return {
        error: {
          statusCode: response.status,
          message,
          details: errors,
        } as ErrorType,
        success: null,
      };
    }

    const success = (await response.json()) as DataType<T>;
    return { success, error: null };
  }

  function buildUrl(url: string, options?: QueryOptionsType) {
    if (options?.params) url = replaceUrlParams(url, options.params);
    if (options?.query) url += `?${objectToQueryString(options.query)}`;
    return API_BASE_URL + url;
  }

  return {
    send(method: MethodType, url: string, options?: QueryOptionsType) {
      return request<any>({
        method,
        url: buildUrl(url, options),
        headers: options?.headers,
        body: options?.body,
        autorefreshToken: options?.autorefreshToken,
      });
    },
    get<T>(url: string, options?: QueryOptionsType) {
      return request<T>({
        method: "GET",
        url: buildUrl(url, options),
        headers: options?.headers,
        autorefreshToken: options?.autorefreshToken,
      });
    },
    post<T>(url: string, options: QueryOptionsType) {
      return request<T>({
        method: "POST",
        url: buildUrl(url, options),
        headers: options.headers,
        body: options.body,
        autorefreshToken: options.autorefreshToken,
      });
    },
    put<T>(url: string, options: QueryOptionsType) {
      return request<T>({
        method: "PUT",
        url: buildUrl(url, options),
        headers: options.headers,
        body: options.body,
        autorefreshToken: options.autorefreshToken,
      });
    },
    patch<T>(url: string, options: QueryOptionsType) {
      return request<T>({
        method: "PATCH",
        url: buildUrl(url, options),
        headers: options.headers,
        body: options.body,
        autorefreshToken: options.autorefreshToken,
      });
    },
    delete<T>(url: string, options: QueryOptionsType) {
      return request<T>({
        method: "DELETE",
        url: buildUrl(url, options),
        headers: options.headers,
        body: options.body,
        autorefreshToken: options.autorefreshToken,
      });
    },
    refreshToken(refreshToken: string) {
      return request<any>({
        method: "POST",
        url: `${API_BASE_URL}${config.refreshEndpoint}`,
        headers: { Authorization: `Bearer ${refreshToken}` },
        autorefreshToken: true,
      });
    },
  };
}