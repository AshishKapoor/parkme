export type HttpClientConfig = {
  baseUrl?: string;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

export async function httpClient<T>(
  url: string,
  options: RequestInit = {},
  config: HttpClientConfig = {},
): Promise<T> {
  const response = await fetch(`${config.baseUrl ?? ""}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
      ...(config.headers ?? {}),
    },
    signal: config.signal ?? options.signal,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || response.statusText);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
