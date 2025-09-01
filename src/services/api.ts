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
 * POST with authentication helper.
 * Returns parsed JSON if present, or undefined for empty 204 responses.
 */
export async function postWithAuth<T = unknown>(
  url: string,
  data: unknown,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();

  const response = await fetch(url, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to post: ${url} (${response.status})`);
  }

  if (response.status === 204) return undefined as unknown as T;

  const text = await response.text();
  if (!text) return undefined as unknown as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export async function deleteWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<boolean> {
  const token = await getToken();

  const response = await fetch(url, {
    ...options,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!response.status || (response.status !== 200 && response.status !== 204)) {
    throw new Error(`Failed to delete: ${url} (${response.status})`);
  }
  return true
}

export async function updateWithAuth<T>(
  url: string,
  data: T,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();

  const response = await fetch(url, {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to update: ${url} (${response.status})`);
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
