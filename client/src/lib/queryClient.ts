import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Use environment variable for API base URL, fallback to localhost in development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Prepend API base URL if the URL is relative (doesn't start with http)
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    let url = queryKey[0] as string;
    
    // If there are additional parameters in the queryKey, add them as query parameters
    if (queryKey.length > 1) {
      const params = new URLSearchParams();
      for (let i = 1; i < queryKey.length; i++) {
        if (queryKey[i] !== undefined && queryKey[i] !== null) {
          // For weather API, we expect lat and lon parameters
          if (i === 1) params.append('lat', String(queryKey[i]));
          if (i === 2) params.append('lon', String(queryKey[i]));
        }
      }
      if (params.toString()) {
        url += '?' + params.toString();
      }
    }

    // Prepend API base URL if the URL is relative (doesn't start with http)
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
