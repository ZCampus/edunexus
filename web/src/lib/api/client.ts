/**
 * API client for EduNexus NestJS backend.
 *
 * Set NEXT_PUBLIC_API_URL (e.g. http://localhost:4000/api/v1) to use the real API.
 * When unset, feature fetchers fall back to local mock data.
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export function isMockApi() {
  return !API_BASE;
}

export type ApiError = {
  status: number;
  message: string;
};

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { token?: string },
): Promise<T> {
  if (!API_BASE) {
    throw new Error("API_BASE_MISSING");
  }

  const { token, ...requestInit } = init ?? {};
  const response = await fetch(`${API_BASE}${path}`, {
    ...requestInit,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(requestInit.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw {
      status: response.status,
      message: message || response.statusText,
    } satisfies ApiError;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function mockDelay(ms = 350) {
  await new Promise((resolve) => window.setTimeout(resolve, ms));
}
