import getToken from "./token";

/**
 * Fetch with authentication (Bearer token).
 */
export async function fetchWithAuth<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${url} (${response.status})`);
  }
  return response.json();
}

/**
 * Fetch without authentication.
 */
export async function fetchPublic<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${url} (${response.status})`);
  }
  return response.json();
}
